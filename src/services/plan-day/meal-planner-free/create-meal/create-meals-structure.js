const createMealsStructure = (mealsCount, snacksCount, mealMacros, snackMacros) => {
  // Step 1: create dynamic meals/snacks body data
  const mealStructure = (number) => ({
    type: 'meal',
    planType: 'free',
    number,
    recommendedMacros: mealMacros,
  });

  const snackStructure = (number) => ({
    type: 'snack',
    planType: 'free',
    number,
    recommendedMacros: snackMacros,
  });

  const structure = [];

  // Step 2: determine the order of meals and snacks
  const maxIterations = Math.max(mealsCount, snacksCount);
  let mealNumber = 1;
  let snackNumber = 1;

  // Step 3: alternate meals and snacks, prioritizing meals
  for (let i = 0; i < maxIterations; i++) {
    if (mealNumber <= mealsCount) {
      structure.push(mealStructure(mealNumber));
      mealNumber++;
    }

    if (snackNumber <= snacksCount && i < maxIterations - 1) {
      // Snack between meals
      structure.push(snackStructure(snackNumber));
      snackNumber++;
    }
  }

  return structure;
};

module.exports = createMealsStructure;
