const mongoose = require('mongoose');
const additionSchema = require('./additoin-schema');
const ingredientSchema = require('./ingredient-schema');
const { toJSON, paginate } = require('../plugins');
const ruleSchema = require('./rule-schema');

const comboSchema = mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
    },
    ingredients: {
      pro: [ingredientSchema],
      carb: [ingredientSchema],
      fat: [ingredientSchema],
    },
    rules: {
      carb: {
        type: ruleSchema,
        required: true,
      },
      pro: {
        type: ruleSchema,
        required: true,
      },
      fat: {
        type: ruleSchema,
        required: true,
      },
    },
    mealNumbers: {
      type: [Number],
      required: true,
    },
    tasteAdditions: [additionSchema],
    extraInfo: {
      en: {
        type: String,
        default: '',
        trim: true,
      },
      ar: {
        type: String,
        default: '',
        trim: true,
      },
    },
    type: {
      type: String,
      enum: ['meal', 'snack'],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

comboSchema.plugin(toJSON);
comboSchema.plugin(paginate);

/**
 * @typedef Combo
 */
const Combo = mongoose.model('Combo', comboSchema);

module.exports = Combo;
