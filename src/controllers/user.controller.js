const httpStatus = require('http-status');

const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const { userService } = require('../services');
const catchAsync = require('../utils/catchAsync');

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const queryUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await userService.queryUsers(filter, options);
  res.send(result);
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(user);
});

const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.params.userId, req.body);
  res.status(httpStatus.OK).send(user);
});

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
});

const createUserAddress = catchAsync(async (req, res) => {
  await userService.createUserAddress(req.body);
  res.status(httpStatus.CREATED).send();
});

const updateUserAddress = catchAsync(async (req, res) => {
  await userService.updateUserAddress(req.params.addressId, req.body);
  res.status(httpStatus.OK).send();
});

const updateUserPreferences = catchAsync(async (req, res) => {
  await userService.updateUserPreferences(req.params.userId, req.body);
  res.status(httpStatus.OK).send();
});

const deleteUserAddress = catchAsync(async (req, res) => {
  await userService.deleteUserAddressById(req.query.userId, req.params.addressId);
  res.status(httpStatus.NO_CONTENT).send();
});

const getUserCustomIngredients = catchAsync(async (req, res) => {
  const customIngredients = await userService.getUserCustomIngredients(req.params.userId);
  res.status(httpStatus.OK).json(customIngredients);
});

const addUserCustomIngredient = catchAsync(async (req, res) => {
  const newIngredient = await userService.addUserCustomIngredient(req.params.userId, req.body);
  res.status(httpStatus.CREATED).json(newIngredient);
});

const updateUserCustomIngredient = catchAsync(async (req, res) => {
  const user = await userService.updateUserCustomIngredient(req.params.userId, req.body);
  res.status(httpStatus.OK).json(user.customIngredients);
});

const deleteUserCustomIngredient = catchAsync(async (req, res) => {
  await userService.deleteUserCustomIngredient(req.params.userId, req.query.ingredientId);
  res.status(httpStatus.NO_CONTENT).send();
});

const initCoachCollab = catchAsync(async (req, res) => {
  await userService.initCoachCollab(req.params.userId, req.body);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  getUser,
  createUser,
  queryUsers,
  updateUser,
  deleteUser,
  initCoachCollab,
  createUserAddress,
  updateUserAddress,
  updateUserPreferences,
  getUserCustomIngredients,
  addUserCustomIngredient,
  updateUserCustomIngredient,
  deleteUserCustomIngredient,
  deleteUserAddress,
};
