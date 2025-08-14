const httpStatus = require('http-status');

const ApiError = require('../../utils/ApiError');
const { PlanDay, User } = require('../../models');

const planDayMealServices = require('./plan-day-meal.service');
const calcTargetMacros = require('./common/calc-target-macros');
// const genFreeMealPlan = require('./meal-planner-free/create-meal');
const calcConsumedMacros = require('./common/calc-consumed-macros');
const chikriceMealsGenerator = require('./ai/chikrice-meals-generator');
const splitMacrosEqually = require('./meal-planner-free/create-meal/split-macros-equally');
const createMealsStructure = require('./meal-planner-free/create-meal/create-meals-structure');
const splitGainWeightMacros = require('./meal-planner-free/create-meal/split-macros-gain-weight');

// --------------------------------------------------------

const queryPlans = async (options) => PlanDay.paginate(null, options);

const getPlan = async (id) => {
  const plan = await PlanDay.findById(id);
  if (!plan) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Plan not found');
  }

  return plan;
};

const createPlan = async (planData) => {
  const { userId, number, name, subscriptionType, date, calories, macrosRatio, mealsCount, snacksCount } = planData;

  const targetMacros = calcTargetMacros(calories, macrosRatio);

  const planBody = {
    date,
    name,
    userId,
    number,
    mealsCount,
    snacksCount,
    targetMacros,
    subscriptionType,
  };

  const plan = await PlanDay.create(planBody);
  return plan;
};

const copyMeals = async (planId, data) => {
  const { sourcePlanId } = data;
  const sourcePlan = await PlanDay.findById(sourcePlanId).lean();
  const targetPlan = await PlanDay.findById(planId);

  if (!sourcePlan) throw new ApiError(httpStatus.NOT_FOUND, 'Source plan not found');
  if (!targetPlan) throw new ApiError(httpStatus.NOT_FOUND, 'Target plan not found');

  targetPlan.meals = sourcePlan.meals;

  // Recalculate consumed macros for the plan day after switching all meals
  const consumedMacros = calcConsumedMacros(targetPlan.meals);
  targetPlan.consumedMacros = consumedMacros;
  await targetPlan.save();
};

const chikricePlanGenerator = async (planId, body) => {
  const plan = await PlanDay.findById(planId);

  if (!plan) {
    throw new ApiError(httpStatus.NOT_FOUND);
  }

  // we need user weight and user goal therefore userId
  const { mealsCount, snacksCount, ingredients, userWeight, userGoal } = body;

  plan.mealsCount = mealsCount;
  plan.snacksCount = snacksCount;

  const { targetMacros } = plan;

  let mealsStructure = [];

  if (userGoal === 'gainWeight') {
    const { mealMacros, snackMacros } = splitGainWeightMacros(mealsCount, snacksCount, targetMacros, userWeight);
    mealsStructure = createMealsStructure(mealsCount, snacksCount, mealMacros, snackMacros);
  } else {
    const { mealMacros, snackMacros } = splitMacrosEqually(mealsCount, snacksCount, targetMacros);
    mealsStructure = createMealsStructure(mealsCount, snacksCount, mealMacros, snackMacros);
  }

  const meals = await chikriceMealsGenerator(mealsStructure, ingredients);

  return meals;
};

const toggleSavePlanDay = async (planId, body) => {
  const { userId } = body;

  const user = await User.findById(userId);

  if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'User not found');

  const planIndex = user.savedPlans.findIndex((id) => id.toHexString() === planId);

  if (planIndex === -1) {
    user.savedPlans.push(planId);
  } else {
    user.savedPlans.splice(planIndex, 1);
  }

  await user.save();
};

const deletePlan = async (planId) => {
  const plan = await PlanDay.findById(planId);
  if (!plan) throw new ApiError(httpStatus.NOT_FOUND, 'Plan not found');

  plan.consumedMacros = { cal: 0, carb: 0, pro: 0, fat: 0 };
  plan.meals = [];
  await plan.save();
};

module.exports = {
  getPlan,
  copyMeals,
  createPlan,
  queryPlans,
  deletePlan,
  toggleSavePlanDay,
  chikricePlanGenerator,

  // meal
  ...planDayMealServices,
};
