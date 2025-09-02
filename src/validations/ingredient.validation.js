const Joi = require('joi');

const { ingredientCategories } = require('../constants');

const { objectId } = require('./custom.validation');

const macrosSchema = Joi.object().keys({
  carb: Joi.number().min(0).required(),
  pro: Joi.number().min(0).required(),
  fat: Joi.number().min(0).required(),
  cal: Joi.number().min(0).required(),
});

const createIngredient = {
  body: Joi.object().keys({
    icon: Joi.string().optional(),
    prepType: Joi.string().valid('none', 'daily', 'batch').required(),
    name: Joi.object()
      .keys({
        en: Joi.string().required().trim(),
        ar: Joi.string().required().trim(),
        fa: Joi.string().optional().trim(),
      })
      .required(),
    macroType: Joi.string().valid('carb', 'fat', 'pro', 'free').required(),
    mealType: Joi.string().valid('meal', 'snack', 'all').required(),
    category: Joi.string()
      .valid(...ingredientCategories)
      .required(),
    isRaw: Joi.bool().optional(),
    serving: Joi.object()
      .keys({
        weightInGrams: Joi.number().required(),
        singleLabel: Joi.object()
          .keys({
            en: Joi.string().optional().trim(),
            ar: Joi.string().optional().trim(),

            fa: Joi.string().optional().trim(),
          })
          .optional(),
        multipleLabel: Joi.object()
          .keys({
            en: Joi.string().optional().trim(),
            ar: Joi.string().optional().trim(),
            fa: Joi.string().optional().trim(),
          })
          .optional(),
        nutrientFacts: macrosSchema.required(),
        breakpoint: Joi.number().required(),
      })
      .required(),
  }),
};

const updateIngredient = {
  body: Joi.object().keys({
    icon: Joi.string().optional(),
    prepType: Joi.string().valid('none', 'daily', 'batch').optional(),
    name: Joi.object()
      .keys({
        en: Joi.string().optional().trim(),
        ar: Joi.string().optional().trim(),
        fa: Joi.string().optional().trim(),
      })
      .optional(),
    macroType: Joi.string().valid('carb', 'fat', 'pro').optional(),
    mealType: Joi.string().valid('meal', 'snack', 'all').optional(),
    category: Joi.string()
      .valid(...ingredientCategories)
      .optional(),
    isRaw: Joi.bool().optional(),
    serving: Joi.object()
      .keys({
        weightInGrams: Joi.number().optional(),
        singleLabel: Joi.object()
          .keys({
            en: Joi.string().optional().trim(),
            ar: Joi.string().optional().trim(),
            fa: Joi.string().optional().trim(),
          })
          .optional(),
        multipleLabel: Joi.object()
          .keys({
            en: Joi.string().optional().trim(),
            ar: Joi.string().optional().trim(),
            fa: Joi.string().optional().trim(),
          })
          .optional(),
        nutrientFacts: macrosSchema.optional(),
        breakpoint: Joi.number().optional(),
      })
      .optional(),
  }),
};

const queryIngredients = {
  query: Joi.object().keys({
    sortBy: Joi.string().optional(),
    limit: Joi.number().integer().optional(),
    page: Joi.number().integer().optional(),
    icon: Joi.string().allow('').optional(),
    macroType: Joi.string().valid('pro', 'carb', 'fat', '').optional(),
    name: Joi.string().allow('').optional(),
    category: Joi.string().allow('').optional(),
  }),
};

const getIngredientsForUser = {
  query: Joi.object().keys({
    userId: Joi.string().custom(objectId).required(),
    query: Joi.string().allow('').optional(),
  }),
};

const getIngredient = {
  params: Joi.object().keys({
    ingredientId: Joi.string().custom(objectId).required(),
  }),
};

const deleteIngredient = {
  params: Joi.object().keys({
    ingredientId: Joi.string().custom(objectId).required(),
  }),
};

module.exports = {
  createIngredient,
  updateIngredient,
  getIngredient,
  queryIngredients,
  getIngredientsForUser,
  deleteIngredient,
};
