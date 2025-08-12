import mongoose from 'mongoose';

// -------------------------------------

const weightProgressionSchema = new mongoose.Schema(
  {
    month: { type: Number, required: true },
    startWeight: { type: Number, required: true },
    targetWeight: { type: Number, required: true },
    weightChange: { type: Number, required: true },
    changePoint: {
      type: {
        day: {
          type: Number,
          required: true,
        },
        weight: {
          type: Number,
          required: true,
        },
      },
      default: null,
    },
  },
  { _id: false },
);

export default weightProgressionSchema;
