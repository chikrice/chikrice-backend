import mongoose from 'mongoose';

import { IngredientType } from '@/types';

import { toJSON, paginate } from '../plugins';

import type { Document, Model } from 'mongoose';
import type { PaginateOptions, QueryResult } from '@/types';

// -------------------------------------

export type IngredientDoc = Document & IngredientType;

interface IngredientModelInterface extends Model<IngredientDoc> {
  paginate(filter: unknown, options: PaginateOptions): Promise<QueryResult<IngredientDoc>>;
}

const ingredientSchema = new mongoose.Schema(
  {
    icon: {
      type: String,
    },
    prepType: {
      type: String,
      enum: ['none', 'daily', 'batch'],
      default: 'none',
    },
    name: {
      en: { type: String, required: true, trim: true },
      ar: { type: String, required: true, trim: true },
      fa: { type: String, required: true, trim: true },
    },
    macroType: {
      type: String,
      enum: ['carb', 'fat', 'pro', 'free'],
      required: true,
    },
    mealType: {
      type: String,
      enum: ['meal', 'snack', 'all'],
      required: true,
    },
    category: {
      type: String,
      enum: [
        'fats',
        'carbs',
        'dairy',
        'fruits',
        'snacks',
        'proteins',
        'condiments',
        'vegetables',
        'sauces',
        'beverages',
      ],
      required: true,
    },
    isRaw: {
      type: Boolean,
      default: false,
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
          required: true,
        },
        carb: {
          type: Number,
          required: true,
        },
        fat: {
          type: Number,
          required: true,
        },
      },
    },
  },
  {
    timestamps: true,
  },
);

ingredientSchema.plugin(toJSON);
ingredientSchema.plugin(paginate);

export const Ingredient = mongoose.model<IngredientDoc, IngredientModelInterface>('Ingredient', ingredientSchema);
