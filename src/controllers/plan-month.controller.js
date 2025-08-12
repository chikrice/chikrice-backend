const httpStatus = require('http-status');
const { planMonthService } = require('../services');
const catchAsync = require('../utils/catchAsync');
const pick = require('../utils/pick');

const createPlan = catchAsync(async (req, res) => {
  const plan = await planMonthService.createPlan(req.body);

  res.status(httpStatus.CREATED).send(plan);
});
const queryPlans = catchAsync(async (req, res) => {
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await planMonthService.queryPlans(options);

  res.send(result);
});
const getPlan = catchAsync(async (req, res) => {
  const plan = await planMonthService.getPlan(req.params.planId);

  res.send(plan);
});
const updatePlan = catchAsync(async (req, res) => {
  const plan = await planMonthService.updatePlan(req.body);

  res.send(plan);
});

const getMealSuggestions = catchAsync(async (req, res) => {
  const options = pick(req.query, ['planDayId', 'mealNumber']);
  const result = await planMonthService.getMealSuggestions(req.params.planId, options);

  res.send(result);
});

module.exports = {
  createPlan,
  queryPlans,
  getPlan,
  updatePlan,
  getMealSuggestions,
};
