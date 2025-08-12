const splitMacrosEqually = (mealsCount, snacksCount, macros) => {
  // Assign 80% of macros to meals and 20% to snacks
  const mealRatio = 0.8;
  const snackRatio = 0.2;

  // Calculate total meal macros (80% of total macros)
  const totalMealMacros = {
    carb: macros.carb * mealRatio,
    pro: macros.pro * mealRatio,
    fat: macros.fat * mealRatio,
    cal: macros.cal * mealRatio,
  };

  // Calculate total snack macros (20% of total macros)
  const totalSnackMacros = {
    carb: macros.carb * snackRatio,
    pro: macros.pro * snackRatio,
    fat: macros.fat * snackRatio,
    cal: macros.cal * snackRatio,
  };

  // Divide meal macros by mealsCount
  const mealMacros = {
    carb: Math.round(totalMealMacros.carb / mealsCount),
    pro: Math.round(totalMealMacros.pro / mealsCount),
    fat: Math.round(totalMealMacros.fat / mealsCount),
    cal: Math.round(totalMealMacros.cal / mealsCount),
  };

  // Divide snack macros by snacksCount
  const snackMacros = {
    carb: Math.round(totalSnackMacros.carb / snacksCount),
    pro: Math.round(totalSnackMacros.pro / snacksCount),
    fat: Math.round(totalSnackMacros.fat / snacksCount),
    cal: Math.round(totalSnackMacros.cal / snacksCount),
  };

  return { mealMacros, snackMacros };
};

module.exports = splitMacrosEqually;
