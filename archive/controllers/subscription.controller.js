const { subscriptionService } = require('../services');
const catchAsync = require('../utils/catchAsync');

const createSubscription = catchAsync(async (req, res) => {
  const subscription = await subscriptionService.createSubscription(req.body);

  res.status(httpStatus.CREATED).send(subscription);
});
const getSubscriptions = catchAsync(async (req, res) => {
  const result = await subscriptionService.getSubscriptions(req.body);

  res.send(result);
});
const getSubscription = catchAsync(async (req, res) => {
  const subscription = await subscriptionService.getSubscription(req.body);

  res.send(subscription);
});
const updateSubscription = catchAsync(async (req, res) => {
  const subscription = await subscriptionService.updateSubscription(req.body);

  res.send(subscription);
});

module.exports = {
  createSubscription,
  getSubscriptions,
  getSubscription,
  updateSubscription,
};
