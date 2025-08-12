const mongoose = require('mongoose');

const { macrosSchema } = require('../common');
const { toJSON, paginate } = require('../plugins');
const { ingredientCategories } = require('../../constants');

// -------------------------------------

const ingredientSchema = mongoose.Schema(
  {
    icon: {
      type: String,
    },
    prepType: {
      type: String,
      enum: ['none', 'daily', 'batch'],
      default: 'none',
    },
    name: {
      en: { type: String, required: true, trim: true },
      ar: { type: String, required: true, trim: true },
      fa: { type: String, required: true, trim: true },
    },
    macroType: {
      type: String,
      enum: ['carb', 'fat', 'pro', 'free'],
      required: true,
    },
    mealType: {
      type: String,
      enum: ['meal', 'snack', 'all'],
      required: true,
    },
    category: {
      type: String,
      enum: ingredientCategories,
      required: true,
    },

    isRaw: {
      type: Boolean,
      default: false,
    },
    serving: {
      weightInGrams: {
        type: Number,
        required: true,
      },
      breakpoint: {
        type: Number,
        required: true,
      },
      singleLabel: {
        en: { type: String, trim: true },
        ar: { type: String, trim: true },
        fa: { type: String, trim: true },
      },
      multipleLabel: {
        en: { type: String, trim: true },
        ar: { type: String, trim: true },
        fa: { type: String, trim: true },
      },

      nutrientFacts: macrosSchema,
    },
  },
  {
    timestamps: true,
  },
);

ingredientSchema.plugin(toJSON);
ingredientSchema.plugin(paginate);

const Ingredient = mongoose.model('Ingredient', ingredientSchema);

module.exports = Ingredient;
