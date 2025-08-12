// Helper function to calculate the macro difference for a meal
const calcMacroDiffs = (meal, recommendedMacros) => {
  const carbDiff = Math.abs(meal.macros.carb - recommendedMacros.carb);
  const proDiff = Math.abs(meal.macros.pro - recommendedMacros.pro); // Protein difference
  const fatDiff = Math.abs(meal.macros.fat - recommendedMacros.fat);
  const maxMacroDiff = Math.max(carbDiff, proDiff, fatDiff);

  return { carbDiff, proDiff, fatDiff, maxMacroDiff };
};

module.exports = calcMacroDiffs;
