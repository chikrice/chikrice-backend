import mongoose from 'mongoose';

import { macrosSchema } from '../common';

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
  },
  mode: {
    type: String,
    enum: ['view', 'edit'],
    default: 'view',
  },
  ingredients: {
    type: [mongoose.Types.ObjectId],
    ref: 'Ingredient',
    default: null,
  },
});

export default MealSchema;
