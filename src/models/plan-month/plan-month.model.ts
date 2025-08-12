import mongoose from 'mongoose';

import { toJSON, paginate } from '../plugins';

import weekSchema from './week-schema';

import type { Document, Model } from 'mongoose';
import type { PaginateOptions, PlanMonthType, QueryResult } from '@/types';

// -------------------------------------

type PlanMonthDoc = Document & PlanMonthType;

interface PlanMonthModelInterface extends Model<PlanMonthDoc> {
  paginate(filter: unknown, options: PaginateOptions): Promise<QueryResult<PlanMonthDoc>>;
}

const planSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    roadmapId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Roadmap',
      required: true,
    },
    milestoneId: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
    },
    subscriptionId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Subscription',
      default: null,
    },
    subscriptionType: {
      type: String,
      enum: ['free', 'premium', 'flexible'],
      default: 'free',
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    totalDays: {
      type: Number,
      required: true,
    },
    totalWeeks: {
      type: Number,
      required: true,
    },
    data: {
      type: [weekSchema],
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

planSchema.plugin(toJSON);
planSchema.plugin(paginate);

const PlanMonth = mongoose.model<PlanMonthDoc, PlanMonthModelInterface>('PlanMonth', planSchema);

export default PlanMonth;
