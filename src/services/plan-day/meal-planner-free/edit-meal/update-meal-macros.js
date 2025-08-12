const updateMealMacros = (activeMeal, ingredientMacros, isAdding) => {
  console.log('🚀 ~ updateMealMacros ~ ingredientMacros:', ingredientMacros);
  const factor = isAdding ? 1 : -1;
  activeMeal.macros.cal += factor * ingredientMacros.cal;
  activeMeal.macros.carb += factor * ingredientMacros.carb;
  activeMeal.macros.pro += factor * ingredientMacros.pro;
  activeMeal.macros.fat += factor * ingredientMacros.fat;
};

module.exports = updateMealMacros;
