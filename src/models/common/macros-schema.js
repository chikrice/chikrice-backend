const mongoose = require('mongoose');

// -------------------------------------

const macrosSchema = mongoose.Schema(
  {
    cal: {
      type: Number,
      required: true,
    },
    pro: {
      type: Number,
      required: true,
    },
    carb: {
      type: Number,
      required: true,
    },
    fat: {
      type: Number,
      required: true,
    },
  },
  { _id: false },
);

module.exports = macrosSchema;
