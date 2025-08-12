const mongoose = require('mongoose');
const { macrosSchema } = require('../common');
const additionSchema = require('../combo/additoin-schema');
const { toJSON, paginate } = require('../plugins');

// Define the base schema with common fields
const mealBaseSchema = new mongoose.Schema(
  {
    planType: {
      type: String,
      enum: ['free', 'premium'],
      required: true,
    },
    comboId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    mealNumbers: {
      type: [Number],
      required: true,
    },
    tasteAdditions: [additionSchema],
    extraInfo: {
      type: String,
    },
    macros: {
      type: macrosSchema,
      required: true,
    },
    type: {
      type: String,
      enum: ['meal', 'snack'],
      required: true,
    },
  },
  { discriminatorKey: 'planType', collection: 'meals' }
);

mealBaseSchema.plugin(toJSON);
mealBaseSchema.plugin(paginate);

// Create the base Meal model
/**
 * @typedef Meal
 */
const Meal = mongoose.model('Meal', mealBaseSchema);

module.exports = Meal;
