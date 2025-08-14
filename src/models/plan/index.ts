import mongoose from 'mongoose';

import { macrosSchema } from '../common';
import { toJSON, paginate } from '../plugins';

import dailyMealSchema from './daily-meal-schema';

// -------------------------------------

const daySchema = mongoose.Schema(
  {
    number: {
      type: Number,
      required: true,
    },
    mealsCount: {
      type: Number,
      required: true,
    },
    snacksCount: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    subscriptionType: {
      type: String,
      enum: ['free', 'premium', 'flexible'],
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    targetMacros: {
      type: macrosSchema,
      required: true,
    },
    consumedMacros: {
      type: macrosSchema,
      default: { cal: 0, pro: 0, carb: 0, fat: 0 },
    },
    meals: {
      type: [dailyMealSchema],
      default: null,
    },
  },
  { timestamps: true },
);

daySchema.plugin(toJSON);
daySchema.plugin(paginate);

const PlanDay = mongoose.model('PlanDay', daySchema);

module.exports = PlanDay;
