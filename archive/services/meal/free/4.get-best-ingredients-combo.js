const { getBestServingSize } = require('./utils/calc-serving-size-limit');

/**
 * Calculates the best combination of ingredients based on (carb | pro | fat) limits and portion sizes.
 * the nutrientItems we are going to recieve in each run are always from one category(carb, pro, fat)
 * the logic behind this function is to split x% of macro on each specefic ingredient
 * ex: [{carb1, ratio: .6}, {carb2, ratio: .2}, {carb3, ratio: .2}]
 * @param {Array} nutrientItems - List of ingredients with ratios and nutrient facts.
 * @param {number} targetMacroInGram - Total grams of (carb, pro, fat) for the combo.
 * @param {string} nutrientType - The macro name to use for calculations (default is 'carb').
 * @returns {Object} - An object with total macros and ingredient details.
 */
const getBestIngredientsCombo = (nutrientItems, targetMacroInGram, nutrientType) => {
  // Initialize total macros
  let totalMacros = { cal: 0, carb: 0, pro: 0, fat: 0 };
  const ingredients = [];

  nutrientItems.forEach(({ ingredient, ratio }) => {
    const { weightInGrams, nutrientFacts, breakpoint, singleLabel, multipleLabel } = ingredient.serving;

    const carbLimit = ratio * targetMacroInGram;
    const portion = getBestServingSize(carbLimit / nutrientFacts[nutrientType], breakpoint);

    // Update total macros
    totalMacros = {
      cal: totalMacros.cal + portion * nutrientFacts.cal,
      carb: totalMacros.carb + portion * nutrientFacts.carb,
      pro: totalMacros.pro + portion * nutrientFacts.pro,
      fat: totalMacros.fat + portion * nutrientFacts.fat,
    };

    ingredients.push({
      id: ingredient.id,
      name: ingredient.name,
      icon: ingredient.icon,
      macroType: ingredient.macroType,
      weightInGrams: portion * weightInGrams,
      serving: {
        qty: portion,
        label: {
          en: portion >= 2 ? multipleLabel.en : singleLabel.en,
          ar: portion >= 2 ? multipleLabel.ar : singleLabel.ar,
        },
      },
      macros: {
        cal: nutrientFacts.cal * portion,
        carb: nutrientFacts.carb * portion,
        pro: nutrientFacts.pro * portion,
        fat: nutrientFacts.fat * portion,
      },
    });
  });

  return {
    macros: totalMacros,
    ingredients,
  };
};

module.exports = getBestIngredientsCombo;
