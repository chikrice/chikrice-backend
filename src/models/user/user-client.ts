import mongoose from 'mongoose';

import User from './user-base';
import addressSchema from './address-schema';
import userIngredientSchema from './user-ingredient-schema';

import type { Document, Model } from 'mongoose';
import type { UserClient } from 'chikrice-types';

// -------------------------------------

type UserClientDoc = UserClient & Document;

type UserClientModel = Model<UserClientDoc>;

const userSchema = new mongoose.Schema({
  startWeight: {
    type: Number,
    min: 0,
    default: null,
  },
  currentWeight: {
    type: Number,
    min: 0,
    default: null,
  },
  targetWeight: {
    type: Number,
    min: 0,
    default: null,
  },
  height: {
    type: Number,
    min: 0,
    default: null,
  },
  activityLevel: {
    type: Number,
    enum: [1, 2, 3, 4, 5, null],
    default: null,
  },
  goalAchievementSpeed: {
    type: String,
    enum: ['slow', 'recommended', 'fast', null],
    default: null,
  },
  isWeightLifting: {
    type: Boolean,
    default: null,
  },
  roadmapId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Roadmap',
    default: null,
  },
  addressBook: {
    type: [
      {
        type: addressSchema,
        required: true,
      },
    ],
    default: [],
  },
  allergicFoods: {
    type: [String],
    default: [],
  },
  savedPlans: {
    type: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'Plan',
        required: true,
      },
    ],
    default: [],
  },
  mealPreferences: {
    type: Object,
    required: true,
    default: {},
  },
  currentCoach: {
    type: Object,
    default: null,
  },
  customIngredients: {
    type: [userIngredientSchema],
    default: [],
  },
});

const UserModel = User.discriminator<UserClientDoc, UserClientModel>('user', userSchema);

export default UserModel;
