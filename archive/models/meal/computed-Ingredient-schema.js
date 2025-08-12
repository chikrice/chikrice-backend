const mongoose = require('mongoose');
const { macrosSchema } = require('../common');

const computedIngredientSchema = mongoose.Schema(
  {
    id: {
      type: mongoose.Types.ObjectId,
      required: true,
    },

    name: {
      en: { type: String, required: true },
      ar: { type: String, required: true },
    },

    icon: {
      type: String,
    },
    weightInGrams: {
      type: Number,
      required: true,
    },
    serving: {
      qty: { type: Number },
      label: {
        en: { type: String, required: true },
        ar: { type: String, required: true },
      },
    },

    macros: {
      type: macrosSchema,
      required: true,
    },
  },
  {
    _id: false,
  }
);

module.exports = computedIngredientSchema;
