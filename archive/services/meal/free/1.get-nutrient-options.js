const calcNutrientComboOptions = require('./2.calc-nutrient-combo-options');
const calcNutrientPortions = require('./3.calc-nutrient-portions');

/**
 * Calculates all possible portion sizes for the given macronutrients.
 * @param {Array} ingredients - List of ingredient objects, each containing nutrient facts.
 * @param {Object} rules - increment, min, and max limits for the macronutrient in grams.
 * @param {string} nutrientType - The type of macronutrient (e.g., 'carb', 'pro', 'fat').
 * @returns {Array} - List of possible options with macronutrients and ingredients.
 */
const getNutrientOptions = (ingredients, rules, nutrientType) => {
  let options = [];

  // Check if there are multiple ingredients to process
  if (ingredients.length > 1) {
    // Calculate combinations for multiple ingredients
    options = calcNutrientComboOptions(ingredients, rules, nutrientType);
  } else if (ingredients.length === 1) {
    // Calculate portions for a single ingredient
    options = calcNutrientPortions(ingredients[0], rules, nutrientType);
  }

  return options;
};

module.exports = getNutrientOptions;
