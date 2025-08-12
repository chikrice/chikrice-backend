const Joi = require('joi');
const { objectId } = require('./custom.validation');

const getMeal = {
  params: Joi.object().keys({
    mealId: Joi.string().required().custom(objectId),
  }),
};

const queryMeals = {
  query: Joi.object().keys({
    comboId: Joi.string().custom(objectId),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer,
  }),
};

module.exports = {
  getMeal,
  queryMeals,
};
