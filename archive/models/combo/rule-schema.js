const mongoose = require('mongoose');

const ruleSchema = mongoose.Schema(
  {
    min: {
      type: Number,
      required: true,
    },
    max: {
      type: Number,
      required: true,
    },
    increment: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

module.exports = ruleSchema;
