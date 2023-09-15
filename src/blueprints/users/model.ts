import { Schema, model } from 'mongoose';
import { NextFunction } from 'express';
import bcrypt from 'bcryptjs';

interface UserDocument {
  username: string;
  email: string;
  password: string;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  createdAt?: Date;
}

const userSchema = new Schema<UserDocument>({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    match: [
      /^[a-zA-Z][a-zA-Z0-9]*$/,
      'Username must be alphanumeric and cannot start with a number',
    ],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Email is not valid',
    ],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const handlePasswordHash = async (next: NextFunction) => {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
};

export default model('User', userSchema);
