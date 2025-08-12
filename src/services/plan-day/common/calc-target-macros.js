/**
 * Calculate the target macros (carbs, protein, fat) in grams based on the total calories and macros ratio.
 *
 * @param {number} calories - The total calories to distribute across carbs, protein, and fat.
 * @param {Object} macrosRatio - An object containing the percentages of carbs, protein, and fat.
 * @returns {Object} - An object containing the grams of carbs, protein, fat, and calories.
 */
const calcTargetMacros = (calories, macrosRatio) => {
  const { carb, pro, fat } = macrosRatio;

  // Calculate total calories for each macro
  const carbCalories = (carb / 100) * calories;
  const proCalories = (pro / 100) * calories;
  const fatCalories = (fat / 100) * calories;

  // Convert calories to grams
  const carbGrams = carbCalories / 4;
  const proGrams = proCalories / 4;
  const fatGrams = fatCalories / 9;

  return {
    cal: +calories.toFixed(),
    carb: +carbGrams.toFixed(),
    pro: +proGrams.toFixed(),
    fat: +fatGrams.toFixed(),
  };
};

module.exports = calcTargetMacros;
