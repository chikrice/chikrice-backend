import mongoose from 'mongoose';

// -------------------------------------

const activityLogSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    consumedCalories: {
      type: Number,
      required: true,
      default: 0,
    },
    targetCalories: {
      type: Number,
      required: true,
    },
    completionPercentage: {
      type: Number,
      required: true,
      min: 0,
      max: 120,
      default: 0,
    },
  },
  { _id: false },
);

export default activityLogSchema;
