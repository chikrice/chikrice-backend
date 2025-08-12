const splitMacrosEqually = require('./split-macros-equally');
const createMealsStructure = require('./create-meals-structure');
const populateMealsStructure = require('./populate-meals-structure');

/**
 *
 * @param {Object} targetMacros
 * @param {String} [targetMacros.cal]
 * @param {String} [targetMacros.carb]
 * @param {String} [targetMacros.pro]
 * @param {String} [targetMacros.fat]
 * @param {Number} mealsCount
 * @param {Number} snacksCount
 * @returns {Promise<DailyMeals>}
 */
const genFreeMealPlan = async (targetMacros, mealsCount, snacksCount) => {
  const { cal, carb, pro, fat } = targetMacros;

  // Step 1: get each meal and snack macros
  const { mealMacros, snackMacros } = splitMacrosEqually(mealsCount, snacksCount, { cal, carb, pro, fat });

  // Step 2: create an empty meals strucuture
  const structure = createMealsStructure(mealsCount, snacksCount, mealMacros, snackMacros);

  // Step 3: populate mealsStructure
  const meals = await populateMealsStructure(structure);

  return meals;
};

module.exports = genFreeMealPlan;
