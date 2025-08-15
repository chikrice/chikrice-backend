import mongoose from 'mongoose';

import { RoadmapType } from '@/types';

import { toJSON, paginate } from '../plugins';

import milestoneSchema from './milestone';
import activityLogSchema from './activity-log';
import weightProgressionSchema from './weight-progression-schema';

import type { Document, Model } from 'mongoose';
import type { PaginateOptions, QueryResult } from '@/types';

// -------------------------------------

export type RoadmapDoc = Document & RoadmapType;

interface RoadmapModelInterface extends Model<RoadmapDoc> {
  paginate(filter: unknown, options: PaginateOptions): Promise<QueryResult<RoadmapDoc>>;
}

const roadmapSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    overview: {
      startWeight: {
        type: Number,
        required: true,
      },
      currentWeight: {
        type: Number,
        default: null,
      },
      targetWeight: {
        type: Number,
        required: true,
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
      totalMonths: {
        type: Number,
        required: true,
      },
      weightProgression: {
        type: [weightProgressionSchema],
        required: true,
      },
      monthlyCalorieAdjustment: {
        type: [{ type: Number, rquired: true }],
        required: true,
      },
    },
    milestones: [milestoneSchema],
    onGoingMonth: {
      type: Number,
      required: true,
      default: 1,
    },
    onGoingDay: {
      type: Number,
      required: true,
      default: 1,
    },
    activityLog: [activityLogSchema],
    isWeightChangeOverLimit: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

roadmapSchema.plugin(toJSON);
roadmapSchema.plugin(paginate);

export const Roadmap = mongoose.model<RoadmapDoc, RoadmapModelInterface>('Roadmap', roadmapSchema);
