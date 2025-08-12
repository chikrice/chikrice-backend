const splitGainWeightMacros = (mealsCount, snacksCount, macros, weight) => {
  const mealRatio = 0.8;
  const snackRatio = 0.2;

  const totalMealMacros = {
    carb: macros.carb * mealRatio,
    pro: macros.pro * mealRatio,
    fat: macros.fat * mealRatio,
    cal: macros.cal * mealRatio,
  };

  const totalSnackMacros = {
    carb: macros.carb * snackRatio,
    pro: macros.pro * snackRatio,
    fat: macros.fat * snackRatio,
    cal: macros.cal * snackRatio,
  };

  // Limit protein based on weight
  const maxPro = weight * 2.5; // Maximum protein allowed (grams)
  const totalPro = macros.pro > maxPro ? maxPro : macros.pro; // If protein exceeds limit, set to maxPro
  const excessPro = macros.pro > maxPro ? macros.pro - maxPro : 0; // Calculate the excess

  // Add excess protein to carbs
  const totalCarb = macros.carb + excessPro;

  // Redistribute the new protein and carbs
  const mealMacros = {
    carb: Math.round((totalCarb * mealRatio) / mealsCount),
    pro: Math.round((totalPro * mealRatio) / mealsCount),
    fat: Math.round(totalMealMacros.fat / mealsCount),
    cal: Math.round(totalMealMacros.cal / mealsCount),
  };

  const snackMacros = {
    carb: Math.round((totalCarb * snackRatio) / snacksCount),
    pro: Math.round((totalPro * snackRatio) / snacksCount),
    fat: Math.round(totalSnackMacros.fat / snacksCount),
    cal: Math.round(totalSnackMacros.cal / snacksCount),
  };

  return { mealMacros, snackMacros };
};

module.exports = splitGainWeightMacros;
