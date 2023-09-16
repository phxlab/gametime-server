import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';
export interface UserDocument {
  name: string;
  email: string;
  username: string;
  password: string;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  createdAt?: Date;
}

const UserSchema = new Schema<UserDocument>({
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

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

export default model('User', UserSchema);
