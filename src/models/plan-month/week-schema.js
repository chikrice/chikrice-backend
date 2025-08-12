const mongoose = require('mongoose');

const { toJSON } = require('../plugins');

const daySchema = require('./day-schema');

// -------------------------------------

const weekSchema = mongoose.Schema({
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

module.exports = weekSchema;
