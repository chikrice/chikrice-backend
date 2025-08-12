const mongoose = require('mongoose');

const { macrosSchema } = require('../common');

// -------------------------------------

const dailyMealSchema = new mongoose.Schema({
  number: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: ['meal', 'snack', 'custom'],
    required: true,
  },
  planType: {
    type: String,
    enum: ['free', 'premium'],
    required: true,
  },
  // we are going to use this macro to get a meal as close to this
  recommendedMacros: {
    type: macrosSchema,
    required: true,
  },

  mode: {
    type: String,
    enum: ['view', 'edit'],
    default: 'view',
  },
  notes: {
    type: String,
    default: '',
  },
  activeMeal: {
    type: Object, // Specify the structure if you have a defined schema for activeMeal
    required: true,
  },
  alternatives: [
    {
      type: Object, // Specify the structure if you have a defined schema for alternatives
    },
  ],
});

module.exports = dailyMealSchema;
