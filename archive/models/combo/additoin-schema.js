const mongoose = require('mongoose');

const { Schema } = mongoose;

const additionSchema = new Schema(
  {
    ingredient: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Ingredient',
      required: true,
    },
    amount: {
      type: String,
    },
  },
  {
    _id: false,
  }
);

module.exports = additionSchema;
