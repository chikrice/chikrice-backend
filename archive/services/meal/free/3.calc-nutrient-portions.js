const { calcServingSizeLimit } = require('./utils/calc-serving-size-limit');

const roundToTwoDecimals = (num) => Math.round(num * 100) / 100;

/**
 * Calculates portion options for a specific macronutrient type.
 * @param {Object} nutrientItem - The nutrient item object containing nutrient facts and serving details.
 * @param {Object} nutrientLimit - The low and high limits of the macronutrient in grams.
 * @param {string} nutrientType - The type of macronutrient ('carb', 'pro', 'fat').
 * @returns {Array} - List of possible portion options with macronutrients and ingredient details.
 */
const calcNutrientPortions = (nutrientItem, nutrientLimit, nutrientType) => {
  if (!nutrientItem || typeof nutrientItem !== 'object' || !('ingredient' in nutrientItem)) {
    return [];
  }

  const options = [];
  const { ingredient } = nutrientItem;

  const { weightInGrams, singleLabel, multipleLabel, breakpoint, nutrientFacts } = ingredient.serving;

  // Step 1: Get the smallest and largest portion sizes
  const { smallestPortion, largestPortion } = calcServingSizeLimit(
    nutrientLimit,
    nutrientFacts[nutrientType],
    breakpoint
  );

  // Step 2: Find all possible portions within smallest and largest portions
  for (let portion = smallestPortion; portion <= largestPortion; portion += breakpoint) {
    const totalCal = portion * nutrientFacts.cal;
    const totalCarb = portion * nutrientFacts.carb;
    const totalPro = portion * nutrientFacts.pro;
    const totalFat = portion * nutrientFacts.fat;

    options.push({
      macros: {
        cal: totalCal,
        carb: totalCarb,
        pro: totalPro,
        fat: totalFat,
      },
      ingredients: [
        {
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
            cal: totalCal,
            carb: totalCarb,
            pro: totalPro,
            fat: totalFat,
          },
        },
      ],
    });
  }

  return options;
};

module.exports = calcNutrientPortions;
