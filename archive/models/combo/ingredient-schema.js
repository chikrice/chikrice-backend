const mongoose = require('mongoose');

const { Schema } = mongoose;

const ingredientSchema = new Schema(
  {
    ratio: {
      type: Number,
      required: true,
    },
    ingredient: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Ingredient',
      required: true,
    },
  },
  { _id: false }
);

module.exports = ingredientSchema;
