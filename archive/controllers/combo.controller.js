const httpStatus = require('http-status');

const pick = require('../utils/pick');
const { comboService } = require('../services');
const catchAsync = require('../utils/catchAsync');

const createCombo = catchAsync(async (req, res) => {
  const combo = await comboService.createCombo(req.body);
  res.status(httpStatus.CREATED).send(combo);
});

const queryCombo = catchAsync(async (req, res) => {
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await comboService.queryCombo(options);
  res.status(httpStatus.OK).send(result);
});

const getCombo = catchAsync(async (req, res) => {
  const combo = await comboService.getCombo(req.params.comboId);

  res.status(httpStatus.OK).send(combo);
});

const updateCombo = catchAsync(async (req, res) => {
  const combo = await comboService.updateCombo(req.params.comboId, req.body);
  res.send(combo);
});

const deleteCombo = catchAsync(async (req, res) => {
  await comboService.deleteCombo(req.params.comboId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createCombo,
  queryCombo,
  getCombo,
  updateCombo,
  deleteCombo,
};
