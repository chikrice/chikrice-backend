const httpStatus = require('http-status');
const { differenceInDays } = require('date-fns');
const calcBMR = require('./calc-bmr');
const calcCalories = require('./calc-calories');
const calcActivityLevel = require('./calc-activity-level');

const { planMonthService } = require('../..');
const ApiError = require('../../../utils/ApiError');

const updateChangePointMilestone = async (user, milestone, changePointWeightProgression, totalCalorieAdjustment) => {
  try {
    const { planId, macrosRatio, startDate } = milestone;
    const { height, age, gender, activityLevel } = user;

    const changeDay = differenceInDays(new Date(), startDate) + 1;

    const newTargetWeight = changePointWeightProgression.targetWeight;
    const newStartWeight = changePointWeightProgression.changePoint.weight;

    const BMR = calcBMR(newStartWeight, height, age, gender);
    const activityMultiplier = calcActivityLevel(activityLevel);
    const { baseCalories, targetCalories } = calcCalories(BMR, activityMultiplier, totalCalorieAdjustment);

    const changePoint = {
      baseCalories,
      targetCalories,
      newStartWeight,
      newTargetWeight,
      date: new Date().toISOString(),
    };

    milestone.changePoint = changePoint;

    if (planId) {
      await planMonthService.updatePlanMacros(planId, changeDay, targetCalories, macrosRatio);
    }

    return milestone;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error updating plan month on roadmap update');
  }
};

module.exports = updateChangePointMilestone;
