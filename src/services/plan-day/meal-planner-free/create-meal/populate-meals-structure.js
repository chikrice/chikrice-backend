const mealService = require('../../../meal');

const populateMealsStructure = async (structure) => {
  const meals = [];

  for (const { type, number, recommendedMacros } of structure) {
    const meal = await mealService.findBestFreeMealOption(type, number, recommendedMacros);
    meals.push(meal);
  }

  return meals;
};

module.exports = populateMealsStructure;
