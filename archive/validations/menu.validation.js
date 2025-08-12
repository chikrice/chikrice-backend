const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createMenuItem = {
  body: Joi.object().keys({}),
};

const updateMenuItem = {
  body: Joi.object().keys({}),
};

const getMenu = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getMenuItem = {
  params: Joi.object().keys({
    menuItemId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createMenuItem,
  updateMenuItem,
  getMenuItem,
  getMenu,
};
