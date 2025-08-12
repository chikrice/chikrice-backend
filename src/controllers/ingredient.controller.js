const httpStatus = require('http-status');

const pick = require('../utils/pick');
const catchAsync = require('../utils/catchAsync');
const { ingredientService } = require('../services');

const createIngredient = catchAsync(async (req, res) => {
  const ingredient = await ingredientService.createIngredient(req.body);
  res.status(httpStatus.CREATED).send(ingredient);
});

const queryIngredients = catchAsync(async (req, res) => {
  const filters = pick(req.query, ['name', 'lang', 'icon', 'category', 'macroType']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await ingredientService.queryIngredients(filters, options);
  res.status(httpStatus.OK).send(result);
});

const getIngredient = catchAsync(async (req, res) => {
  const ingredient = await ingredientService.getIngredient(req.params.ingredientId);
  res.status(httpStatus.OK).send(ingredient);
});

const getIngredientsForUser = catchAsync(async (req, res) => {
  const filters = pick(req.query, ['userId', 'query']);
  const result = await ingredientService.getIngredientsForUser(filters);
  res.status(httpStatus.OK).send(result);
});
const getIngredientsByCategories = catchAsync(async (req, res) => {
  const result = await ingredientService.getIngredientsByCategories(req.body);
  res.status(httpStatus.OK).send(result);
});

const updateIngredient = catchAsync(async (req, res) => {
  const ingredient = await ingredientService.updateIngredient(req.params.ingredientId, req.body);
  res.status(httpStatus.OK).send(ingredient);
});

const deleteIngredient = catchAsync(async (req, res) => {
  await ingredientService.deleteIngredient(req.params.ingredientId, req.body);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createIngredient,
  getIngredient,
  updateIngredient,
  queryIngredients,
  getIngredientsForUser,
  getIngredientsByCategories,
  deleteIngredient,
};
