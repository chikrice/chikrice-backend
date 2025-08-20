import mongoose from 'mongoose';

import { toJSON } from '../plugins';
import { macrosSchema } from '../common';

import mealIngredientSchema from './meal-ingredient-schema';

// -------------------------------------

const MealSchema = new mongoose.Schema({
  number: {
    type: Number,
    required: true,
  },
  recommendedMacros: {
    type: macrosSchema,
    required: true,
  },
  macros: {
    type: macrosSchema,
    required: true,
    default: { cal: 0, carb: 0, pro: 0, fat: 0 },
  },
  mode: {
    type: String,
    enum: ['view', 'edit'],
    default: 'edit',
  },
  type: {
    type: String,
    enum: ['meal', 'snack'],
    default: 'meal',
  },
  ingredients: {
    carb: {
      type: [mealIngredientSchema],
      default: [],
    },
    pro: {
      type: [mealIngredientSchema],
      default: [],
    },
    fat: {
      type: [mealIngredientSchema],
      default: [],
    },
    free: {
      type: [mealIngredientSchema],
      default: [],
    },
  },
});

MealSchema.plugin(toJSON);

export default MealSchema;
