/**
 * Determines the user's goal (bulk or cut) based on start and target weights.
 *
 * @param {number} startWeight - The user's starting weight
 * @param {number} targetWeight - The user's target weight
 * @returns {string} - 'bulk' if gaining weight, 'cut' if losing weight
 */
const determineGoal = (startWeight, targetWeight) => {
  return startWeight < targetWeight ? 'bulk' : 'cut';
};

/**
 * Updates the change point target weight based on new and old goals, caloric adjustments, and time.
 *
 * @param {number} leftDays - Number of days left in the current month
 * @param {number} startWeight - Original start weight
 * @param {number} newStartWeight - Updated start weight
 * @param {number} oldTargetWeight - Original target weight
 * @param {number} newTargetWeightInput - New target weight to aim for
 * @param {number} entireMonthWeightChange - The current month weight change from start to end
 * @returns {number} - The updated target weight for the change point
 */
const updateChangePointTargetWeight = (
  leftDays,
  startWeight,
  newStartWeight,
  oldTargetWeight,
  newTargetWeightInput,
  entireMonthWeightChange
) => {
  // Step 1: Determine the old and new user goals
  const oldGoal = determineGoal(startWeight, oldTargetWeight);
  const newGoal = determineGoal(newStartWeight, newTargetWeightInput);

  // Step 2: Calculate the initial caloric adjustment
  const weightChange = entireMonthWeightChange * (leftDays / 30);

  const adjustedWeightChange = oldGoal === newGoal ? weightChange : weightChange * 1.3;

  // Step 3: Calculate the updated target weight by adding the weight difference to the new start weight
  const updatedTargetWeight = newStartWeight + adjustedWeightChange;
  return parseFloat(updatedTargetWeight.toFixed(1));
};

module.exports = updateChangePointTargetWeight;
