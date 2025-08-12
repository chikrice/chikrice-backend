const { comboService } = require('../..');

const openaiMealGenerator = require('./openai-meal-generator');

const chikriceMealsGenerator = async (structure, ingredients) => {
  const meals = [];

  for (const { number, type, recommendedMacros } of structure) {
    const { preferredCombos, unpreferredCombos } = await comboService.getPossibleCombos(number, type, ingredients);
    console.log('🚀 ~ structure.forEach ~ preferredCombos:', preferredCombos);

    meals.push({ preferredCombos, unpreferredCombos });
  }

  return meals;
};

module.exports = chikriceMealsGenerator;
