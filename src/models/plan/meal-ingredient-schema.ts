import mongoose from 'mongoose';

import { toJSON } from '../plugins';
import { macrosSchema } from '../common';

// -------------------------------------

const localizedStringSchema = new mongoose.Schema(
  {
    en: { type: String, required: true, trim: true },
    ar: { type: String, required: true, trim: true },
    fa: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const servingSchema = new mongoose.Schema(
  {
    weightInGrams: {
      type: Number,
      required: true,
      default: 0,
    },
    breakpoint: {
      type: Number,
      required: true,
      default: 1,
    },
    singleLabel: {
      type: localizedStringSchema,
      required: true,
      default: { en: '', ar: '', fa: '' },
    },
    multipleLabel: {
      type: localizedStringSchema,
      required: true,
      default: { en: '', ar: '', fa: '' },
    },
    nutrientFacts: {
      type: macrosSchema,
      required: true,
      default: { cal: 0, carb: 0, pro: 0, fat: 0 },
    },
  },
  { _id: false },
);

const portionSchema = new mongoose.Schema(
  {
    qty: {
      type: Number,
      required: true,
      default: 1,
    },
    label: {
      type: localizedStringSchema,
      required: true,
      default: { en: '', ar: '', fa: '' },
    },
    weightInGrams: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { _id: false },
);

const mealIngredientSchema = new mongoose.Schema({
  ingredientId: {
    type: String,
    required: true,
  },
  name: {
    type: localizedStringSchema,
    required: true,
    default: { en: '', ar: '', fa: '' },
  },
  icon: {
    type: String,
    default: '',
  },
  macroType: {
    type: String,
    enum: ['carb', 'pro', 'fat', 'free', 'custom'],
    required: true,
  },
  serving: {
    type: servingSchema,
    required: true,
    default: () => ({
      weightInGrams: 0,
      breakpoint: 1,
      singleLabel: { en: '', ar: '', fa: '' },
      multipleLabel: { en: '', ar: '', fa: '' },
      nutrientFacts: { cal: 0, carb: 0, pro: 0, fat: 0 },
    }),
  },
  isAiGenerated: {
    type: Boolean,
    default: false,
  },
  portion: {
    type: portionSchema,
    required: true,
    default: () => ({
      qty: 1,
      label: { en: '', ar: '', fa: '' },
      weightInGrams: 0,
    }),
  },
  macros: {
    type: macrosSchema,
    required: true,
    default: { cal: 0, carb: 0, pro: 0, fat: 0 },
  },
});

mealIngredientSchema.plugin(toJSON);

export default mealIngredientSchema;
