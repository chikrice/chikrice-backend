const calcBMR = require('./utils/calc-bmr');
const calcCalories = require('./utils/calc-calories');
const calcMacrosRatio = require('./utils/calc-macros-ratio');
const calcActivityLevel = require('./utils/calc-activity-level');
const calcMilestoneDates = require('./utils/calc-milestone-dates');

const createMilestone = (milestonDetails) => {
  const {
    age,
    gender,
    height,
    isGainWeight,
    activityLevel,
    isWeightLifting,
    //
    month,
    startDate,
    totalMonths,
    weightProgression,
    monthlyCalorieAdjustment,
  } = milestonDetails;

  // Step 1: get constants
  const activityMultiplier = calcActivityLevel(activityLevel);

  const startWeight = weightProgression[month - 1].targetWeight;
  const { targetWeight } = weightProgression[month];

  // Step 3: calculate BMR
  const BMR = calcBMR(startWeight, height, age, gender);

  // Step 4: calcualte base and target calories
  const { baseCalories, targetCalories } = calcCalories(BMR, activityMultiplier, monthlyCalorieAdjustment[month - 1]);

  // Step 5: calculate start and end date
  const { milestoneStartDate, milestoneEndDate } = calcMilestoneDates(startDate, month);

  // Step 6: calculate calorieAdjustment
  const calorieAdjustment = {
    type: isGainWeight ? 'surplus' : 'deficit',
    day: Math.abs(monthlyCalorieAdjustment[month - 1]),
    month: Math.abs(monthlyCalorieAdjustment[month - 1] * 30),
  };

  // Step 7: claculate macrosRatio
  const macrosRatio = calcMacrosRatio(month, totalMonths, isGainWeight, gender, isWeightLifting);

  const milestone = {
    month,
    macrosRatio,
    startWeight,
    targetWeight,
    baseCalories,
    targetCalories,
    calorieAdjustment,
    startDate: milestoneStartDate,
    endDate: milestoneEndDate,
  };

  return milestone;
};

module.exports = createMilestone;
