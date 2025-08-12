const calcRoadmapDates = require('./utils/calc-roadmap-dates');
const calcRoadmapSummary = require('./utils/cal-roadmap-summary');
const calcInitialCalories = require('./utils/calc-initial-calories');

const genRoadmapOverview = (startWeight, targetWeight, goalAchievementSpeed, roadmapStartDate) => {
  const isGainWeight = targetWeight > startWeight;
  const weightChange = Math.abs(targetWeight - startWeight);

  const initialCalorieAdjustment = calcInitialCalories(goalAchievementSpeed);

  const { totalDays, totalMonths, monthlyCalorieAdjustment } = calcRoadmapSummary(
    weightChange,
    isGainWeight,
    initialCalorieAdjustment,
  );

  const { startDate, endDate } = calcRoadmapDates(totalDays, roadmapStartDate);

  return {
    endDate,
    startDate,
    totalDays,
    totalMonths,
    isGainWeight,
    weightChange,
    monthlyCalorieAdjustment,
  };
};

module.exports = genRoadmapOverview;
