import mongoose from 'mongoose';

// -------------------------------------

const daySchema = new mongoose.Schema(
  {
    id: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'PlanDay',
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
  { _id: false },
);

export default daySchema;
