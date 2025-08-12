const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createSubscription = {
  body: Joi.object().keys({
    userId: Joi.string().custom(objectId),
    planId: Joi.string().custom(objectId),
    milestoneId: Joi.string().custom(objectId),
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
  }),
};

const getSubscriptions = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getSubscription = {
  params: Joi.object().keys({
    subscriptionId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createSubscription,
  getSubscription,
  getSubscriptions,
};
