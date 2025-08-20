import mongoose from 'mongoose';

import { macrosSchema } from '../common';
import { toJSON, paginate } from '../plugins';

import MealSchema from './meal-schema';

import type { Document, Model } from 'mongoose';
import type { PaginateOptions, PlanType, QueryResult } from '@/types';

// -------------------------------------

export type PlanDoc = Document & PlanType;

export interface PlanModelInterface extends Model<PlanDoc> {
  paginate(filter: unknown, options: PaginateOptions): Promise<QueryResult<PlanDoc>>;
}

const PlanSchema = new mongoose.Schema(
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
      type: [MealSchema],
      default: [],
    },
  },
  { timestamps: true },
);

PlanSchema.plugin(toJSON);
PlanSchema.plugin(paginate);

export const Plan = mongoose.model<PlanDoc, PlanModelInterface>('Plan', PlanSchema);
