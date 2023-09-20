import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';
import * as jose from 'jose';

export interface UserDocument {
  name: string;
  email: string;
  username: string;
  password: string;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  createdAt?: Date;
  matchPassword(enteredPassword: string): Promise<boolean>;
  getToken(): Promise<string>;
}

const User = new Schema<UserDocument>({
  name: {
    type: String,
    required: [true, 'Name is required.'],
  },
  email: {
    type: String,
    required: [true, 'Email is required.'],
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Email is not valid',
    ],
    unique: true,
  },
  username: {
    type: String,
    required: [true, 'Username is required.'],
    match: [
      /^[a-zA-Z][a-zA-Z0-9]*$/,
      'Username must be alphanumeric and cannot start with a number',
    ],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required.'],
    minLength: [6, 'Password must be at least 6 characters'],
    select: false,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now,
    select: false,
  },
});

User.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

User.methods.matchPassword = async function (enteredPassword: string) {
  return bcrypt.compare(enteredPassword, this.password);
};

User.methods.getToken = async function () {
  const encoder = new TextEncoder();
  const JWT_SECRET = encoder.encode(Bun.env.JWT_SECRET);

  return new jose.SignJWT({ id: this._id })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(Bun.env.JWT_EXPIRE as string)
    .sign(JWT_SECRET);
};

export default model('User', User);
