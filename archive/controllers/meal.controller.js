const httpStatus = require('http-status');
const { mealService } = require('../services');
const ApiError = require('../utils/ApiError');
const pick = require('../utils/pick');
const catchAsync = require('../utils/catchAsync');

const getMeal = catchAsync(async (req, res) => {
  const meal = await mealService.getMeal(req.params.mealId);

  if (!meal) {
    throw new ApiError(httpStatus.NOT_FOUND);
  }

  res.status(httpStatus.OK).send(meal);
});

const queryMeals = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['comboId']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const results = await mealService.queryMeals(filter, options);

  res.status(httpStatus.OK).send(results);
});

module.exports = {
  getMeal,
  queryMeals,
};
