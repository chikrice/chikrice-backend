const { menuService } = require('../services');
const catchAsync = require('../utils/catchAsync');

const createMenuItem = catchAsync(async (req, res) => {
  const menuItem = await menuService.createMenuItem(req.body);

  res.status(httpStatus.CREATED).send(menuItem);
});
const getMenu = catchAsync(async (req, res) => {
  const result = await menuService.getMenu(req.body);

  res.send(result);
});
const getMenuItem = catchAsync(async (req, res) => {
  const menuItem = await menuService.getMenuItem(req.body);

  res.send(menuItem);
});

const updateMenuItem = catchAsync(async (req, res) => {
  const menuItem = await menuService.updateMenuItem(req.body);

  res.send(menuItem);
});

module.exports = {
  createMenuItem,
  getMenu,
  getMenuItem,
  updateMenuItem,
};
