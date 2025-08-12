/**
 * Calculate the calorie adjustments required each month based on weight change and user inputs.
 *
 * @param {number} weightChange - The desired weight change in kilograms.
 * @param {boolean} isGainWeight - Whether the goal is to gain weight (true) or lose weight (false).
 * @param {number} initialCalorieAdjustment - The initial calorie adjustment value.
 * @returns {object} - An object containing:
 *                     - totalMonths: The total number of months required.
 *                     - totalDays: The total number of days required.
 *                     - monthlyCalorieAdjustment: An array with each month's adjusted calorie requirement.
 */
const calcRoadmapSummary = (weightChange, isGainWeight, initialCalorieAdjustment) => {
  // Determine calorie adjustment direction (gain or lose)
  const calorieAdjustmentFactor = isGainWeight ? 1 : -1;

  // If weight change is less equal to 2 return one month
  if (weightChange <= 2) {
    const monthlyCalorieAdjustment = weightChange ? [calorieAdjustmentFactor * initialCalorieAdjustment] : [];
    return {
      totalDays: 30,
      totalMonths: 1,
      monthlyCalorieAdjustment,
    };
  }

  // Constants
  const CALORIES_PER_KG = 7700;
  const DAYS_PER_MONTH = 30;
  const CALORIE_INCREMENT = 100;

  // Calculate the total calories needed for the weight change
  const totalCaloriesNeeded = weightChange * CALORIES_PER_KG;

  // Initialize variables
  const calorieAdjustments = [];
  let remainingCalories = totalCaloriesNeeded;
  let currentCalorieAdjustment = initialCalorieAdjustment;

  // Loop to calculate monthly calorie adjustments until all calories are accounted for
  while (remainingCalories > 0) {
    // Add the current month's calorie adjustment to the array
    calorieAdjustments.push(currentCalorieAdjustment * calorieAdjustmentFactor);

    // Decrease the remaining calories
    remainingCalories -= currentCalorieAdjustment * DAYS_PER_MONTH;

    // Increase or decrease the calorie adjustment for the next month
    currentCalorieAdjustment += CALORIE_INCREMENT;
  }

  // Calculate total months and days
  const totalMonths = calorieAdjustments.length;
  const totalDays = totalMonths * DAYS_PER_MONTH;

  return {
    totalMonths,
    totalDays,
    monthlyCalorieAdjustment: calorieAdjustments,
  };
};

module.exports = calcRoadmapSummary;
