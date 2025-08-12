const { isEqual } = require('date-fns');
const httpStatus = require('http-status');

const { Roadmap } = require('@/models/roadmap');

const { PlanDay } = require('../../models');
const ApiError = require('../../utils/ApiError');
const PlanMonth = require('../../models/plan-month');
const calcTargetMacros = require('../plan-day/common/calc-target-macros');

const calcWeeksData = require('./calc-weeks-data');
const calcPlanDuration = require('./calc-plan-duration');

const createPlan = async ({ roadmapId }) => {
  const roadmap = await Roadmap.findById(roadmapId);

  if (!roadmap) throw new ApiError(httpStatus.NOT_FOUND, 'Roadmap not found');
  const { onGoingMonth, milestones, userId } = roadmap;

  const milestone = milestones[onGoingMonth - 1];
  const { _id, startDate, endDate, targetCalories, macrosRatio } = milestone;

  // Step1: calulate number of days and weeks
  const { totalDays, totalWeeks } = calcPlanDuration(startDate, endDate);

  // Step 2: calculate weeks data
  const weeksData = await calcWeeksData(totalWeeks, totalDays, startDate, targetCalories, macrosRatio, userId);

  // Step 3: combine data
  const plan = {
    userId,
    roadmapId,
    milestoneId: _id,
    totalDays,
    totalWeeks,
    startDate,
    endDate,
    data: weeksData,
  };
  const createdPlan = await PlanMonth.create(plan);
  await Roadmap.findByIdAndUpdate(roadmapId, {
    $set: {
      [`milestones.${onGoingMonth - 1}.planId`]: createdPlan._id,
    },
  });

  return createdPlan;
};

const queryPlans = async (options) => PlanMonth.paginate(null, options);

const getPlan = async (id) => {
  const plan = await PlanMonth.findById(id);
  if (!plan) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Plan not found');
  }
  return plan;
};

const getMealSuggestions = async (planMonthId, body) => {
  const { planDayId, mealNumber } = body;

  if (!mealNumber || mealNumber <= 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid meal number');
  }

  // Fetch planMonth and planDay by their IDs
  const planMonth = await PlanMonth.findById(planMonthId);
  if (!planMonth) throw new ApiError(httpStatus.NOT_FOUND, 'Plan month not found');

  const planDay = await PlanDay.findById(planDayId);
  if (!planDay) throw new ApiError(httpStatus.NOT_FOUND, 'Plan day not found');

  const planMonthData = planMonth.data.flatMap((week) => week.days);

  // Find the target plan index by date comparison
  const targetPlanIndex = planMonthData.findIndex((plan) => isEqual(new Date(plan.date), new Date(planDay.date)));

  if (targetPlanIndex === -1) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Plan day not found in plan month data');
  }

  // Get the previous 3 plans (or fewer if at the start)
  const prevPlans = planMonthData.slice(Math.max(0, targetPlanIndex - 3), targetPlanIndex);
  const prevPlanIds = prevPlans.map((plan) => plan.id);

  // Fetch previous PlanDay documents
  const documents = await PlanDay.find({ _id: { $in: prevPlanIds } });

  // Use a Set to track unique meal IDs for suggestions
  const suggestions = [];
  const mealIdsSet = new Set();

  documents.forEach((doc) => {
    const { meals } = doc;
    if (Array.isArray(meals) && meals[mealNumber - 1]) {
      const meal = meals[mealNumber - 1];

      // Check if the meal is already in suggestions using its _id
      if (meal && !mealIdsSet.has(meal._id.toString())) {
        suggestions.unshift(meal);
        mealIdsSet.add(meal._id.toString()); // Add meal._id to the Set to avoid duplicates
      }
    }
  });

  return suggestions;
};

const updatePlanMacros = async (planId, changeDay, calories, macrosRatio) => {
  // Step 1: Fetch plan details
  const plan = await PlanMonth.findById(planId);
  if (!plan) {
    throw new ApiError(httpStatus.NOT_FOUND, `Monthly plan with id ${planId} not found`);
  }

  const { data: weeks } = plan;

  // Step 2: Calculate the start week and day indices based on the changeDay
  const changeWeekIndex = Math.floor((changeDay - 1) / 7); // Calculate week index
  const changeDayWeekIndex = (changeDay - 1) % 7; // Calculate day index in that week

  // Step 3: Collect all the days' ids that need to be updated
  const daysToUpdate = [];

  for (let week = changeWeekIndex; week < weeks.length; week++) {
    for (let day = 0; day < weeks[week].days.length; day++) {
      // Skip the days before the change point in the first affected week
      // eslint-disable-next-line
      if (week === changeWeekIndex && day < changeDayWeekIndex) continue;

      daysToUpdate.push(weeks[week].days[day].id);
    }
  }

  // Step 4 Calculate the new targetMacros
  const targetMacros = calcTargetMacros(calories, macrosRatio);

  // Step 5: Perform a bulk update for all the collected plan days
  if (daysToUpdate.length) {
    await PlanDay.updateMany({ _id: { $in: daysToUpdate } }, { $set: { targetMacros } });
  }
};

module.exports = {
  getPlan,
  createPlan,
  queryPlans,
  updatePlanMacros,
  getMealSuggestions,
};
