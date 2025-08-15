import mongoose from 'mongoose';

import { toJSON } from '../plugins';

// -------------------------------------

const milestoneSchema = new mongoose.Schema({
  month: {
    type: Number,
    required: true,
  },
  plans: {
    type: [
      {
        plan: {
          type: mongoose.SchemaTypes.ObjectId,
          ref: 'Plan',
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
        number: {
          type: Number,
          required: true,
        },
      },
    ],
    default: null,
  },
  startWeight: {
    type: Number,
    required: true,
  },
  targetWeight: {
    type: Number,
    required: true,
  },
  baseCalories: {
    type: Number,
    required: true,
  },
  targetCalories: {
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
  macrosRatio: {
    type: {
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
  calorieAdjustment: {
    type: {
      type: String,
      enum: ['deficit', 'surplus'],
      required: true,
    },
    day: {
      type: Number,
      default: 0,
    },
    month: {
      type: Number,
      default: 0,
    },
  },
  changePoint: {
    type: {
      baseCalories: {
        type: Number,
        required: true,
      },
      targetCalories: {
        type: Number,
        required: true,
      },
      date: {
        type: Date,
        required: true,
      },
      newStartWeight: {
        type: Number,
        default: null,
      },
      newTargetWeight: {
        type: Number,
        default: null,
      },
    },
    default: null,
  },
});

milestoneSchema.plugin(toJSON);

export default milestoneSchema;
