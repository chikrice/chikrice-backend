const mongoose = require('mongoose');

// -------------------------------------

const addressSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  fullAddress: {
    type: String,
    required: true,
  },
  addressType: {
    type: String,
    enum: ['home', 'office'],
    default: 'home',
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  isPrimary: {
    type: Boolean,
    required: true,
    default: false,
  },
  addressLink: {
    type: String,
    required: true,
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  notes: {
    type: String,
    default: null,
  },
});

export default addressSchema;
