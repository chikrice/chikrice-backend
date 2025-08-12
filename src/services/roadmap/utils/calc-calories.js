/**
 * Calculate the base and target calories based on BMR, activity level, and weight goal.
 *
 * @param {number} BMR - Basal Metabolic Rate (calories burned at rest).
 * @param {number} activityMultiplier - Factor representing the user's activity level.
 * @param {number} totalCalorieAdjustment - total calorie adjustment for weight goals.
 * @returns {object} - An object containing baseCalories and targetCalories.
 */
const calcCalories = (BMR, activityMultiplier, totalCalorieAdjustment) => {
  // Calculate base calories by multiplying BMR by activity level
  const baseCalories = BMR * activityMultiplier;

  // Calculate the final target calories by adding/subtracting the adjusted calorie change to/from base calories
  const targetCalories = baseCalories + totalCalorieAdjustment;

  // Return an object containing the base and target calories
  return { baseCalories, targetCalories };
};

module.exports = calcCalories;
