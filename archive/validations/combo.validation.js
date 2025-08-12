const Joi = require('joi');
const { objectId } = require('./custom.validation');

// Ingredient validation schema
const ingredientSchema = Joi.object({
  ratio: Joi.number().min(0).max(1).required(),
  ingredient: Joi.string().custom(objectId).required(),
});

// Rule validation schema
const ruleSchema = Joi.object({
  min: Joi.number().required(),
  max: Joi.number().required(),
  increment: Joi.number().required(),
});

// Combo validation schema
const createCombo = {
  body: Joi.object({
    key: Joi.array().items(Joi.string()).required(),
    ingredients: Joi.object({
      carb: Joi.array().items(ingredientSchema).optional(),
      pro: Joi.array().items(ingredientSchema).optional(),
      fat: Joi.array().items(ingredientSchema).optional(),
    }).required(),
    rules: Joi.object({
      carb: ruleSchema,
      pro: ruleSchema,
      fat: ruleSchema,
    }).required(),
    mealNumbers: Joi.array().items(Joi.number().integer().min(1)).required(),
    tasteAdditions: Joi.array()
      .items(
        Joi.object({
          ingredient: Joi.string().custom(objectId).required(),
          amount: Joi.string().optional(),
        })
      )
      .optional(),
    extraInfo: Joi.string().optional(),
    type: Joi.string().valid('meal', 'snack').required(),
  }),
};

const queryCombo = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getCombo = {
  params: Joi.object().keys({
    comboId: Joi.string().required().custom(objectId),
  }),
};

const updateCombo = {
  params: Joi.object().keys({
    comboId: Joi.string().required().custom(objectId),
  }),
  body: Joi.object({
    key: Joi.array().items(Joi.string()).required(),
    ingredients: Joi.object({
      carb: Joi.array().items(ingredientSchema).optional(),
      pro: Joi.array().items(ingredientSchema).optional(),
      fat: Joi.array().items(ingredientSchema).optional(),
    }).required(),
    rules: Joi.object({
      carb: ruleSchema,
      pro: ruleSchema,
      fat: ruleSchema,
    }).required(),
    mealNumbers: Joi.array().items(Joi.number().integer().min(1)).required(),
    tasteAdditions: Joi.array()
      .items(
        Joi.object({
          ingredient: Joi.string().custom(objectId).required(),
          amount: Joi.string().optional(),
        })
      )
      .optional(),
    extraInfo: Joi.string().optional(),
    type: Joi.string().valid('meal', 'snack').required(),
  }),
};

const deleteCombo = {
  params: Joi.object().keys({
    comboId: Joi.string().required().custom(objectId),
  }),
};

module.exports = {
  createCombo,
  queryCombo,
  getCombo,
  updateCombo,
  deleteCombo,
};
