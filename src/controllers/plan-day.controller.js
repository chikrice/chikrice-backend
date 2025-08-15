const httpStatus = require('http-status');

const pick = require('../utils/pick');
const { planDayService } = require('../services');
const catchAsync = require('../utils/catchAsync');

const createPlan = catchAsync(async (req, res) => {
  const plan = await planDayService.createPlan(req.body);

  res.status(httpStatus.CREATED).send(plan);
});

const queryPlans = catchAsync(async (req, res) => {
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await planDayService.queryPlans(options);

  res.send(result);
});

const getPlan = catchAsync(async (req, res) => {
  const plan = await planDayService.getPlan(req.params.planId);

  res.send(plan);
});

const initCustomMeal = catchAsync(async (req, res) => {
  await planDayService.initCustomMeal(req.params.planId);

  res.status(httpStatus.OK).send();
});

const updatePlanDayMeal = catchAsync(async (req, res) => {
  await planDayService.updatePlanDayMeal(req.params.planId, req.body);

  res.status(httpStatus.OK).send();
});

const deletePlanDayMeal = catchAsync(async (req, res) => {
  await planDayService.deletePlanDayMeal(req.params.planId, req.query.mealId);

  res.status(httpStatus.OK).send();
});

const switchMeal = catchAsync(async (req, res) => {
  await planDayService.switchMeal(req.params.planId, req.body);

  res.status(httpStatus.OK).send();
});

const submitMealWithAi = catchAsync(async (req, res) => {
  await planDayService.submitMealWithAi(req.params.planId, req.body);

  res.status(httpStatus.OK).send();
});

const addSuggestedMealToPlanDayMeals = catchAsync(async (req, res) => {
  await planDayService.addSuggestedMealToPlanDayMeals(req.params.planId, req.body);

  res.status(httpStatus.OK).send();
});

const toggleMealMode = catchAsync(async (req, res) => {
  await planDayService.toggleMealMode(req.params.planId, req.body);

  res.status(httpStatus.OK).send();
});
const togglePlanDayMealIngredient = catchAsync(async (req, res) => {
  await planDayService.togglePlanDayMealIngredient(req.params.planId, req.body);

  res.status(httpStatus.OK).send();
});

const changeAllMeals = catchAsync(async (req, res) => {
  await planDayService.changeAllMeals(req.params.planId);

  res.status(httpStatus.OK).send();
});

const copyMeals = catchAsync(async (req, res) => {
  await planDayService.copyMeals(req.params.planId, req.body);

  res.status(httpStatus.OK).send();
});

const deletePlan = catchAsync(async (req, res) => {
  await planDayService.deletePlan(req.params.planId);

  res.status(httpStatus.OK).send();
});

// const chikricePlanner = catchAsync(async (req, res) => {
//   await planDayService.chikricePlanner(req.params.planId);

//   res.status(httpStatus.OK).send();
// });

const chikricePlanGenerator = catchAsync(async (req, res) => {
  const result = await planDayService.chikricePlanGenerator(req.params.planId, req.body);

  res.status(httpStatus.OK).send(result);
});

const toggleSavePlanDay = catchAsync(async (req, res) => {
  await planDayService.toggleSavePlanDay(req.params.planId, req.body);

  res.status(httpStatus.OK).send();
});

module.exports = {
  getPlan,
  copyMeals,
  createPlan,
  queryPlans,
  switchMeal,
  deletePlan,
  initCustomMeal,
  changeAllMeals,
  toggleMealMode,
  // chikricePlanner,
  submitMealWithAi,
  updatePlanDayMeal,
  deletePlanDayMeal,
  toggleSavePlanDay,
  chikricePlanGenerator,
  togglePlanDayMealIngredient,
  addSuggestedMealToPlanDayMeals,
};
