const getBestIngredientsCombo = require('./4.get-best-ingredients-combo');

/**
 * Calculates all possible combinations of a specific macronutrient based on a given range.
 * @param {Array} nutrientItems - List of ingredients with their ratios and nutrient facts.
 * @param {Object} rules - increment, min, and max limits for the macronutrient in grams.
 * @param {string} nutrientType - The type of nutrient to calculate options for ('carb', 'pro', 'fat').
 * @returns {Array} - An array of possible combinations with their macro details.
 */

const calcNutrientComboOptions = (nutrientItems, rules, nutrientType) => {
  // Initialize an empty array to store the combinations
  const options = [];
  let lastMacros = { cal: 0, carb: 0, pro: 0, fat: 0 };
  // Iterate over the range of nutrients from minimum to maximum, stepping by rules.increment
  for (let targetMacroInGram = rules.min; targetMacroInGram <= rules.max; targetMacroInGram += rules.increment) {
    // Calculate the best combination of ingredients for the current nutrient amount
    // this nutrient items are (por, carb, fat)
    const combo = getBestIngredientsCombo(nutrientItems, targetMacroInGram, nutrientType);
    const { macros } = combo;

    if (macros.pro !== lastMacros.pro && macros.carb !== lastMacros.carb) {
      options.push(combo);

      lastMacros = { ...macros };
    }
  }

  // Return the array of possible combinations
  return options;
};

module.exports = calcNutrientComboOptions;

/**
 * how to make sure not create the smae combo twice?
 */
