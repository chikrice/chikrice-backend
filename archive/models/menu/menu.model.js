const mongoose = require('mongoose');
const { macrosSchema } = require('../common');
const { toJSON, paginate } = require('../plugins');

const menuSchema = mongoose.Schema(
  {
    name: {
      en: { type: String, required: true, trim: true },
      ar: { type: String, required: true, trim: true },
    },
    description: {
      en: { type: String, trim: true },
      ar: { type: String, trim: true },
    },
    category: {
      type: String,
      enum: ['all', 'salad', 'rice', 'pasta', 'burger', 'pizza', 'sandwich', 'snacks', 'drinks'],
      required: true,
    },
    type: {
      type: String,
      enum: ['meal', 'snack'],
      required: true,
    },
    macros: {
      type: macrosSchema,
      required: true,
    },
    imageUrl: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

menuSchema.plugin(toJSON);
menuSchema.plugin(paginate);

const Menu = mongoose.model('Menu', menuSchema);

module.exports = Menu;
