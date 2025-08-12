/**
 * Transforms variations of ingredients into meal objects.
 *
 * @param {Array} allVariations - An array of ingredient variations, each containing arrays of carb, pro, and fat objects.
 * @param {string} type - The type of meal (e.g., meal, snack).
 * @param {Array} mealNumbers - The meal number for tracking (e.g., 1 for breakfast).
 * @param {String} extraInfo - Additional information about the meal.
 * @param {Array} tasteAdditions - Any additional taste-related ingredients or flavors.
 * @returns {Array} - Array of transformed meal objects with calculated macros and structured ingredients.
 */
const transformVarientsToMeals = (allVariations, type, mealNumbers, extraInfo, tasteAdditions) => {
  const mealTemplate = (macros, ingredients) => ({
    planType: 'free',
    type,
    mealNumbers,
    extraInfo,
    tasteAdditions,
    macros,
    ingredients,
  });

  const maxCal = type === 'meal' ? 800 : 400;

  const meals = [];

  for (const [carb, pro, fat] of allVariations) {
    const totalCal = (carb?.macros.cal || 0) + (pro?.macros.cal || 0) + (fat?.macros.cal || 0);

    // Skip this iteration if total calories exceed 800
    if (totalCal > maxCal) continue;

    const finalIngredients = {
      carb: carb?.ingredients || [],
      pro: pro?.ingredients || [],
      fat: fat?.ingredients || [],
    };
    const macros = {
      cal: totalCal,
      carb: (carb?.macros.carb || 0) + (pro?.macros.carb || 0) + (fat?.macros.carb || 0),
      pro: (carb?.macros.pro || 0) + (pro?.macros.pro || 0) + (fat?.macros.pro || 0),
      fat: (carb?.macros.fat || 0) + (pro?.macros.fat || 0) + (fat?.macros.fat || 0),
    };

    meals.push(mealTemplate(macros, finalIngredients));
  }

  return meals;
};

module.exports = transformVarientsToMeals;
