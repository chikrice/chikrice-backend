import mongoose from 'mongoose';

// -------------------------------------

const activityLogSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    active: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false },
);

export default activityLogSchema;
