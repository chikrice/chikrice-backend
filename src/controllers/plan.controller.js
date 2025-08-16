const httpStatus = require('http-status');

const pick = require('../utils/pick');
const { planService } = require('../services');
const catchAsync = require('../utils/catchAsync');

const createPlans = catchAsync(async (req, res) => {
  const plan = await planService.createPlans(req.body);

  res.status(httpStatus.CREATED).send(plan);
});

const queryPlans = catchAsync(async (req, res) => {
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const filters = pick(req.query, ['roadmapId', 'milestoneId']);
  const result = await planService.queryPlans({ ...options, ...filters });

  res.send(result);
});

const getPlan = catchAsync(async (req, res) => {
  const plan = await planService.getPlan(req.params.planId);

  res.send(plan);
});

const initMeal = catchAsync(async (req, res) => {
  await planService.initMeal(req.params.planId);

  res.status(httpStatus.OK).send();
});

const updatePlanMeal = catchAsync(async (req, res) => {
  await planService.updatePlanMeal(req.params.planId, req.body);

  res.status(httpStatus.OK).send();
});

const deletePlanMeal = catchAsync(async (req, res) => {
  await planService.deletePlanMeal(req.params.planId, req.query.mealId);

  res.status(httpStatus.OK).send();
});

const submitMealWithAi = catchAsync(async (req, res) => {
  await planService.submitMealWithAi(req.params.planId, req.body);

  res.status(httpStatus.OK).send();
});

const addSuggestedMealToPlanMeals = catchAsync(async (req, res) => {
  await planService.addSuggestedMealToPlanMeals(req.params.planId, req.body);

  res.status(httpStatus.OK).send();
});

const toggleMealMode = catchAsync(async (req, res) => {
  await planService.toggleMealMode(req.params.planId, req.body);

  res.status(httpStatus.OK).send();
});

const togglePlanMealIngredient = catchAsync(async (req, res) => {
  await planService.togglePlanMealIngredient(req.params.planId, req.body);

  res.status(httpStatus.OK).send();
});

const copyMeals = catchAsync(async (req, res) => {
  await planService.copyMeals(req.params.planId, req.body);

  res.status(httpStatus.OK).send();
});

const deletePlan = catchAsync(async (req, res) => {
  await planService.deletePlan(req.params.planId);

  res.status(httpStatus.OK).send();
});

const toggleSavePlan = catchAsync(async (req, res) => {
  await planService.toggleSavePlan(req.params.planId, req.body);

  res.status(httpStatus.OK).send();
});

module.exports = {
  getPlan,
  copyMeals,
  createPlans,
  queryPlans,
  deletePlan,
  initMeal,
  toggleMealMode,
  submitMealWithAi,
  updatePlanMeal,
  deletePlanMeal,
  toggleSavePlan,
  togglePlanMealIngredient,
  addSuggestedMealToPlanMeals,
};
