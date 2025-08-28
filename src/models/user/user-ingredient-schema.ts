import mongoose from 'mongoose';

import { toJSON } from '../plugins';

const userIngredientSchema = new mongoose.Schema(
  {
    name: {
      en: { type: String, required: true, trim: true },
      ar: { type: String, required: true, trim: true },
      fa: { type: String, required: true, trim: true },
    },
    icon: {
      type: String,
    },
    macroType: {
      type: String,
      enum: ['custom'],
      required: true,
    },
    serving: {
      weightInGrams: {
        type: Number,
        required: true,
      },
      breakpoint: {
        type: Number,
        required: true,
      },
      singleLabel: {
        en: { type: String, trim: true },
        ar: { type: String, trim: true },
        fa: { type: String, trim: true },
      },
      multipleLabel: {
        en: { type: String, trim: true },
        ar: { type: String, trim: true },
        fa: { type: String, trim: true },
      },
      nutrientFacts: {
        cal: {
          type: Number,
          required: true,
        },
        pro: {
          type: Number,
        },
        carb: {
          type: Number,
        },
        fat: {
          type: Number,
        },
      },
    },
  },
  {
    timestamps: true,
  },
);
userIngredientSchema.plugin(toJSON);
export default userIngredientSchema;
