const splitGainWeightMacros = require('../../../../src/services/plan-day/meal-planner-free/create-meal/split-macros-gain-weight');

describe('splitGainWeightMacros', () => {
  it('should limit protein based on weight and redistribute excess to carbs', () => {
    const mealsCount = 3;
    const snacksCount = 2;
    const macros = {
      carb: 300,
      pro: 200, // Protein to be reduced based on weight
      fat: 100,
      cal: 2500,
    };
    const weight = 75; // Weight in kg

    const { mealMacros, snackMacros } = splitGainWeightMacros(mealsCount, snacksCount, macros, weight);

    // Expected protein limit: 75 * 2.5 = 187.5 (rounded to 188)
    const expectedTotalPro = 188;
    // Excess protein (200 - 188 = 12) is added to carbs
    const expectedTotalCarb = 300 + (200 - 188);

    // Calculate totals from distributed macros
    const totalPro = mealMacros.pro * mealsCount + snackMacros.pro * snacksCount;
    const totalCarb = mealMacros.carb * mealsCount + snackMacros.carb * snacksCount;
    const totalFat = mealMacros.fat * mealsCount + snackMacros.fat * snacksCount;
    const totalCal = mealMacros.cal * mealsCount + snackMacros.cal * snacksCount;

    // Allow a tolerance of 1 gram for carbs and fat
    expect(totalPro).toBe(expectedTotalPro);
    expect(Math.abs(totalCarb - expectedTotalCarb)).toBeLessThanOrEqual(1);
    expect(Math.abs(totalFat - macros.fat)).toBeLessThanOrEqual(1);
    expect(Math.abs(totalCal - macros.cal)).toBeLessThanOrEqual(1);
  });
});
