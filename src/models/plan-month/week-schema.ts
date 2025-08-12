import mongoose from 'mongoose';

import { toJSON } from '../plugins';

import daySchema from './day-schema';

// -------------------------------------

const weekSchema = new mongoose.Schema({
  weekNumber: {
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
  days: {
    type: [daySchema],
    required: true,
  },
});

weekSchema.plugin(toJSON);

export default weekSchema;
