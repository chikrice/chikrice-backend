import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import validator from 'validator';

import { roles } from '@/config/roles';

import { paginate, toJSON } from '../plugins';

import type { Document, Model, Types } from 'mongoose';
import type { PaginateOptions, QueryResult, UserBase } from 'chikrice-types';

// -------------------------------------

interface UserBaseMethods {
  isPasswordMatch(password: string): Promise<boolean>;
}

export type UserBaseDoc = Document & UserBase & UserBaseMethods;

interface UserBaseModelInterface extends Model<UserBaseDoc> {
  isEmailTaken(email: string, excludeUserId?: Types.ObjectId): Promise<boolean>;
  paginate(filter: unknown, options: PaginateOptions): Promise<QueryResult<UserBaseDoc>>;
}

const baseUserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    registrationMethod: {
      type: String,
      enum: ['google', 'manual', 'admin'],
      default: 'manual',
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: (value: string) => validator.isEmail(value),
        message: 'Invalid email',
      },
    },
    password: {
      type: String,
      trim: true,
      minlength: 8,
      validate: {
        validator: (value: string) => /[a-zA-Z]/.test(value) && /\d/.test(value),
        message: 'Password must contain at least one letter and one number',
      },
      private: true,
    },
    role: {
      type: String,
      enum: roles,
      default: 'user',
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationCode: {
      type: String,
      default: null,
      private: true, // Don't include in JSON responses
    },
    emailVerificationCodeExpires: {
      type: Date,
      default: null,
      private: true, // Don't include in JSON responses
    },
    age: {
      type: Number,
      min: 0,
      default: null,
    },
    gender: {
      type: String,
      enum: ['male', 'female', null],
      default: null,
    },
    picture: {
      type: String,
      default: null,
    },
    phoneNumber: {
      type: String,
      default: null,
      validate: {
        validator: (value: string | null) => value === null || validator.isMobilePhone(value, 'ar-AE'),
        message: 'Invalid phone number',
      },
    },
  },
  { discriminatorKey: 'role', timestamps: true },
);

baseUserSchema.plugin(toJSON);
baseUserSchema.plugin(paginate);

baseUserSchema.pre<UserBaseDoc>('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

baseUserSchema.statics.isEmailTaken = async function (email: string, excludeUserId?: Types.ObjectId): Promise<boolean> {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

baseUserSchema.methods.isPasswordMatch = async function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

const UserBaseModel = mongoose.model<UserBaseDoc, UserBaseModelInterface>('User', baseUserSchema);
export default UserBaseModel;
