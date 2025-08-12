const Joi = require('joi');
const { objectId } = require('./custom.validation');

const queryCoach = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};
const getCoach = {
  params: Joi.object().keys({
    coachId: Joi.string().custom(objectId),
  }),
};

const getCoachClient = {
  query: Joi.object().keys({
    coachId: Joi.string().custom(objectId),
    clientId: Joi.string().custom(objectId),
  }),
};

const queryCoachClients = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

module.exports = {
  getCoach,
  queryCoach,
  getCoachClient,
  queryCoachClients,
};
