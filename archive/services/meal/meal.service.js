const getNutrientOptions = require('./free/1.get-nutrient-options');
const getAllVariations = require('./free/5.get-all-meal-variations');
const transformVarientsToMeals = require('./free/6.transform-varients-to-meals');
const { FreeMeal, Meal } = require('../../models');
const calcMacroDiffs = require('./free/utils/calc-macro-difference');
const getCleanMealObject = require('./free/utils/get-clean-meal-object');
const getRandomMeal = require('./free/utils/get-random-meal');

/**
 * Get Meal with specefic id
 * @param {String} mealId
 * @returns {Promise<Meal>}
 */
const getMeal = async (mealId) => {
  return await Meal.findById(mealId);
};

/**
 *
 * @param {Object} filter
 * @param {String} [filter.comboId] - filter meals base no comboId
 * @param {Object} options
 * @param {String} [options.sortBy]
 * @param {String} [options.limit]
 * @param {String} [options.page]
 * @returns
 */
const queryMeals = async (filter, options) => {
  console.log(filter);

  return FreeMeal.paginate(filter, options);
};

/**
 *
 * @param {String} type - meal | snack
 * @param {Number} number - meal order in the plan
 * @param {Object} recommendedMacros
 * @param {Number} [recommendedMacros.cal]
 * @param {Number} [recommendedMacros.carb]
 * @param {Number} [recommendedMacros.pro]
 * @param {Number} [recommendedMacros.fat]
 * @returns {Promise<Object>} - Contains activeMeal and alternatives
 */
const findBestFreeMealOption = async (type, number, recommendedMacros) => {
  // Fetch meals based on type and number
  const meals = await Meal.find({
    type,
    mealNumbers: { $in: [number] },
    'macros.cal': { $gte: recommendedMacros.cal - 100, $lte: recommendedMacros.cal + 100 },
  }).lean();

  const bestMealsByCombo = new Map(); // Track best meal for each comboId based on maxMacroDifference
  const validMeals = []; // Store all meals that pass the criteria for random selection

  meals.forEach((meal) => {
    const { maxMacroDiff } = calcMacroDiffs(meal, recommendedMacros);

    // Track the best meal per comboId based on maxMacroDifference
    const comboId = meal.comboId.toString();
    const existingBestMeal = bestMealsByCombo.get(comboId);

    if (!existingBestMeal || maxMacroDiff < existingBestMeal.maxMacroDiff) {
      bestMealsByCombo.set(comboId, { ...meal, maxMacroDiff });
    }

    // Store this meal if it passes the calorie test
    validMeals.push(getCleanMealObject(meal));
  });

  // Randomly select the best meal from all valid meals
  const bestMeal = getRandomMeal(validMeals);

  // Create alternatives excluding the best meal
  const alternatives = Array.from(bestMealsByCombo.values())
    .filter((meal) => meal.comboId.toHexString() !== bestMeal.comboId.toHexString())
    .map((meal) => getCleanMealObject(meal));

  // Return the meal plan
  return {
    type,
    number,
    planType: 'free',
    recommendedMacros,
    activeMeal: bestMeal,
    alternatives,
  };
};

/**
 * Create free meals variations base on the combo we recieve
 * @param {Object} combo
 */
const createFreeMealVariations = async (combo) => {
  const { id: comboId, ingredients, rules, type, mealNumbers, extraInfo, tasteAdditions } = combo;

  const carbOptions = getNutrientOptions(ingredients.carb, rules.carb, 'carb');
  const proOptions = getNutrientOptions(ingredients.pro, rules.pro, 'pro');
  const fatOptions = getNutrientOptions(ingredients.fat, rules.fat, 'fat');

  const allVariations = getAllVariations([carbOptions, proOptions, fatOptions]);

  const mealVariations = transformVarientsToMeals(allVariations, type, mealNumbers, extraInfo, tasteAdditions);

  for (const meal of mealVariations) {
    meal.comboId = comboId;
    await FreeMeal.create(meal);
  }
};

/**
 * Delete all meals related to the recieved comboId
 * @param {String} comboId
 */
const deleteFreeMealsVariations = async (comboId) => {
  await Meal.deleteMany({ comboId });
};

module.exports = {
  getMeal,
  queryMeals,
  findBestFreeMealOption,
  createFreeMealVariations,
  deleteFreeMealsVariations,
};

/**
 * how I want the meal generator to work?
 * 1. I need to be casos with using extra protein
 * why? because they are expensive so I can find the meal with closes protein and cal fuck the carb and fat
 *
 * 2. I don't want to generate same plan everyday
 * meaning we are going to choose bestMeal randomly from the best matches
 */
