const mongoose = require('mongoose');
const Meal = require('../meal.model');

// Define the PremiumMeal schema (specific fields for premium meals)
const PremiumMeal = Meal.discriminator(
  'premium',
  new mongoose.Schema({
    imgUrl: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      default: 'all',
    },
    name: {
      en: { type: String, required: true },
      ar: { type: String, required: true },
    },
  })
);

module.exports = PremiumMeal;
