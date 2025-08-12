const mongoose = require('mongoose');
const Meal = require('../meal.model');
const computedIngredientSchema = require('../computed-Ingredient-schema');

// Define the FreeMeal schema (specific fields for free meals)
const FreeMeal = Meal.discriminator(
  'free',
  new mongoose.Schema({
    ingredients: {
      carb: [
        {
          type: computedIngredientSchema,
          required: true,
        },
      ],
      pro: [
        {
          type: computedIngredientSchema,
          required: true,
        },
      ],
      fat: [
        {
          type: computedIngredientSchema,
          required: true,
        },
      ],
    },
  })
);

module.exports = FreeMeal;
