const Joi = require('joi');

const { objectId } = require('./custom.validation');

const createPlan = {
  body: Joi.object().keys({
    userId: Joi.string().custom(objectId),
    roadmapId: Joi.string().custom(objectId),
    milestoneId: Joi.string().custom(objectId),
    calories: Joi.number().required(),
    macrosRatio: Joi.object().keys({
      carb: Joi.number().required(),
      pro: Joi.number().required(),
      fat: Joi.number().required(),
    }),
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
    subscriptionType: Joi.string().required().valid('free', 'premium', 'flexible'),
  }),
};

const queryPlans = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getPlan = {
  params: Joi.object().keys({
    planId: Joi.string().custom(objectId),
  }),
};
const getMealSuggestions = {
  params: Joi.object().keys({
    planId: Joi.string().custom(objectId),
  }),
  query: Joi.object().keys({
    planDayId: Joi.string().custom(objectId),
    mealNumber: Joi.number().integer(),
  }),
};

module.exports = {
  createPlan,
  getPlan,
  queryPlans,
  getMealSuggestions,
};
