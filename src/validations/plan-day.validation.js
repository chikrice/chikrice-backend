const Joi = require('joi');
const { objectId } = require('./custom.validation');

const toggleSavePlanDay = {
  params: Joi.object().keys({
    planId: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

// const chikricePlanner = {
//   params: Joi.object().keys({
//     planId: Joi.string().custom(objectId),
//   }),
// };

const chikricePlanGenerator = {
  params: Joi.object().keys({
    planId: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys({
    mealsCount: Joi.number().required(),
    snacksCount: Joi.number().required(),
    // notes: Joi.string().allow('').optional(),
    userWeight: Joi.number().required(),
    userGoal: Joi.string().valid('loseWeight', 'gainWeight').required(),
    ingredients: Joi.object().keys({
      carbs: Joi.array().required(),
      proteins: Joi.array().required(),
      fats: Joi.array().required(),
      fruits: Joi.array().required(),
      dairy: Joi.array().optional(),
      snacks: Joi.array().optional(),
    }),
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

const changeAllMeals = {
  params: Joi.object().keys({
    planId: Joi.string().custom(objectId),
  }),
};

const initCustomMeal = {
  params: Joi.object().keys({
    planId: Joi.string().custom(objectId),
  }),
};

const updatePlanDayMeal = {
  params: Joi.object().keys({
    planId: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys({
    mealId: Joi.string().custom(objectId),
    ingredient: Joi.object().required(),
    isAdd: Joi.bool().required(),
  }),
};

const deletePlanDayMeal = {
  params: Joi.object().keys({
    planId: Joi.string().custom(objectId),
  }),
  query: Joi.object().keys({
    mealId: Joi.string().custom(objectId).required(),
  }),
};

const switchMeal = {
  params: Joi.object().keys({
    planId: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys({
    index: Joi.number().required(),
    alternativeIndex: Joi.number().allow(null).required(),
  }),
};
const submitMealWithAi = {
  params: Joi.object().keys({
    planId: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys({
    prompt: Joi.string().required(),
    mealId: Joi.string().custom(objectId),
  }),
};

const addSuggestedMealToPlanDayMeals = {
  params: Joi.object().keys({
    planId: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys({
    meal: Joi.object().required(),
  }),
};

const toggleMealMode = {
  params: Joi.object().keys({
    planId: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys({
    mealId: Joi.string().custom(objectId).required(),
    userId: Joi.string().custom(objectId).required(),
    mode: Joi.string().valid('view', 'edit').required(),
    notes: Joi.string().allow('').optional(),
  }),
};

const togglePlanDayMealIngredient = {
  params: Joi.object().keys({
    planId: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys({
    mealId: Joi.string().custom(objectId).required(),
    userId: Joi.string().custom(objectId).required(),
    ingredient: Joi.object().required(),
  }),
};

const copyMeals = {
  params: Joi.object().keys({
    planId: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys({
    sourcePlanId: Joi.string().required(),
  }),
};

const deletePlan = {
  params: Joi.object().keys({
    planId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  getPlan,
  copyMeals,
  queryPlans,
  deletePlan,
  switchMeal,
  initCustomMeal,
  toggleMealMode,
  changeAllMeals,
  // chikricePlanner,
  submitMealWithAi,
  updatePlanDayMeal,
  deletePlanDayMeal,
  toggleSavePlanDay,
  chikricePlanGenerator,
  togglePlanDayMealIngredient,
  addSuggestedMealToPlanDayMeals,
};
