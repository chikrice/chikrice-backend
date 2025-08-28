const mongoose = require('mongoose');
const httpStatus = require('http-status');

const ApiError = require('../../utils/ApiError');
const { PlanDay, User } = require('../../models');
const userService = require('../user/user.service');
const getCurrentTimeSlot = require('../../utils/get-time-slot');

const getMealMacroWithAi = require('./ai/get-meal-macro-with-ai');
const calcConsumedMacros = require('./common/calc-consumed-macros');
const updateIngredient = require('./meal-planner-free/edit-meal/update-ingredient');
const updateMealMacros = require('./meal-planner-free/edit-meal/update-meal-macros');
const calcDefaultIngredientServing = require('./meal-planner-free/create-meal/calc-default-ingredient-serving');

// PATCH
const initCustomMeal = async (planId) => {
  const planDay = await PlanDay.findById(planId);

  if (!planDay) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Plan not found');
  }

  const mealCount = planDay.meals.reduce((count, meal) => count + (meal.type !== 'snack' ? 1 : 0), 1);

  const { meals } = planDay;

  const newMeal = {
    number: mealCount,
    mode: 'edit',
    type: 'custom',
    planType: 'free',
    recommendedMacros: { cal: 0, carb: 0, pro: 0, fat: 0 },
    activeMeal: { ingredients: { carb: [], pro: [], fat: [], free: [] }, macros: { cal: 0, carb: 0, pro: 0, fat: 0 } },
    alternatives: [],
  };

  meals.push(newMeal);

  await planDay.save();
};

const toggleMealMode = async (planId, body) => {
  const planDay = await PlanDay.findById(planId);
  if (!planDay) throw new ApiError(httpStatus.NOT_FOUND, 'Plan not found');

  const { mealId, mode, userId, notes } = body;
  const meal = planDay.meals.find((m) => m._id.toHexString() === mealId);

  if (meal) {
    meal.mode = mode;

    if (mode === 'view') {
      meal.notes = notes;
      // eslint-disable-next-line no-use-before-define
      await updateUserMealPreferences(userId, meal.activeMeal.ingredients);
    }
  }

  await planDay.save();
};

const updateUserMealPreferences = async (userId, ingredients) => {
  const user = await User.findById(userId);
  const timeSlot = getCurrentTimeSlot();

  if (!user.mealPreferences[timeSlot]) user.mealPreferences[timeSlot] = { carb: {}, pro: {}, fat: {}, free: {} };

  Object.entries(ingredients).forEach(([key, values]) => {
    values.forEach((ing) => {
      const preference = user.mealPreferences[timeSlot]?.[key][ing.id] || {};
      preference.portionSize = ing.serving.qty;
      user.mealPreferences[timeSlot][key][ing.id] = preference;
    });
  });

  user.markModified('mealPreferences');
  await user.save();
};

const switchMeal = async (planId, data) => {
  const planDay = await PlanDay.findById(planId);

  if (!planDay) throw new ApiError(httpStatus.NOT_FOUND, 'Plan not found');

  const { index, alternativeIndex } = data;

  const meal = planDay.meals[index];
  const { activeMeal, alternatives } = meal;

  if (!alternatives.length) throw new ApiError(httpStatus.BAD_REQUEST, 'There are no alternatives for this meal');

  // Determine the index of the alternative meal to use
  const finalAlternativeIndex =
    alternativeIndex != null ? alternativeIndex : Math.floor(Math.random() * alternatives.length);
  const alternativeMeal = alternatives[finalAlternativeIndex];

  // Swap the active meal with the alternative meal
  meal.alternatives[finalAlternativeIndex] = activeMeal;
  meal.activeMeal = alternativeMeal;

  // Calculate and update consumed macros
  const consumedMacros = calcConsumedMacros(planDay.meals);
  planDay.consumedMacros = consumedMacros;

  planDay.markModified('meals');
  await planDay.save();
};

const submitMealWithAi = async (planId, body) => {
  const planDay = await PlanDay.findById(planId);
  if (!planDay) throw new ApiError(httpStatus.NOT_FOUND, 'Plan not found');

  const { prompt, mealId } = body;
  const aiResult = await getMealMacroWithAi(prompt);

  if (!aiResult) {
    return null;
  }

  // eslint-disable-next-line no-shadow
  const meal = planDay.meals.find((meal) => meal._id.toHexString() === mealId);

  // Ensure meal and its ingredients exist
  if (meal && meal.activeMeal) {
    aiResult.ingredients.forEach((ing) => {
      const newId = new mongoose.Types.ObjectId();
      // eslint-disable-next-line no-param-reassign
      ing.id = newId.toHexString();
      // eslint-disable-next-line no-param-reassign
      ing.isAiGenerated = true;
      const existingIngredients = meal.activeMeal.ingredients[ing.macroType] || [];
      meal.activeMeal.ingredients[ing.macroType] = [...existingIngredients, ing];
      meal.activeMeal.macros.cal += ing.macros.cal;
      meal.activeMeal.macros.carb += ing.macros.carb;
      meal.activeMeal.macros.pro += ing.macros.pro;
      meal.activeMeal.macros.fat += ing.macros.fat;
    });

    // Recalculate consumed macros after adding ingredients
    planDay.consumedMacros = calcConsumedMacros(planDay.meals);
    // here
    planDay.markModified('meals');
    await planDay.save();
  }
};

const addSuggestedMealToPlanDayMeals = async (planId, body) => {
  const planDay = await PlanDay.findById(planId);

  if (!planDay) throw new ApiError(httpStatus.NOT_FOUND, 'Plan not found');

  const { meal } = body;

  planDay.meals[meal.number - 1] = meal;

  planDay.consumedMacros = calcConsumedMacros(planDay.meals);

  // here

  planDay.markModified('meals');
  await planDay.save();
};

const changeAllMeals = async (planId) => {
  // Fetch the plan day by ID
  const planDay = await PlanDay.findById(planId);

  // Check if the plan exists
  if (!planDay) throw new ApiError(httpStatus.NOT_FOUND, 'Plan not found');

  // Loop through each meal in the plan day
  planDay.meals.forEach((meal) => {
    const { activeMeal, alternatives } = meal;

    // Only switch the meal if alternatives are available
    if (alternatives.length) {
      // Randomly select an alternative meal
      const alternativeIndex = Math.floor(Math.random() * alternatives.length);
      const alternativeMeal = alternatives[alternativeIndex];

      // Swap the active meal with the alternative meal
      // eslint-disable-next-line no-param-reassign
      meal.alternatives[alternativeIndex] = activeMeal;
      // eslint-disable-next-line no-param-reassign
      meal.activeMeal = alternativeMeal;
    }
  });

  // Recalculate consumed macros for the plan day after switching all meals
  const consumedMacros = calcConsumedMacros(planDay.meals);
  planDay.consumedMacros = consumedMacros;

  // Mark the meals array as modified and save the changes
  planDay.markModified('meals');
  await planDay.save();
};

const togglePlanDayMealIngredient = async (planId, body) => {
  const { mealId, ingredient, userId } = body;

  // eslint-disable-next-line no-use-before-define
  const { planDay, activeMeal, macroGroup, ingredientIndex } = await getMealAndIngredientInfo(
    planId,
    mealId,
    ingredient,
  );

  if (ingredientIndex !== -1) {
    // Ingredient exists: Remove it and update macros
    const removedIngredient = macroGroup.splice(ingredientIndex, 1)[0];

    updateMealMacros(activeMeal, removedIngredient.macros, false);

    // Update user preferences: Decrement count
    await userService.updateUserIngredientCount({
      userId,
      ingredient,
      isAdding: false,
    });
  } else {
    // Ingredient doesn't exist: Add it with default serving and update macros
    const ingToAdd = await calcDefaultIngredientServing(userId, ingredient, planDay.targetMacros);

    macroGroup.push(ingToAdd);
    updateMealMacros(activeMeal, ingToAdd.macros, true);

    // Update user preferences: Increment count
    await userService.updateUserIngredientCount({
      userId,
      ingredient,
      isAdding: true,
      portionSize: ingToAdd.portion.qty,
    });
  }

  // Step 5: Recalculate consumed macros and save changes
  const calculatedMacros = calcConsumedMacros(planDay.meals);
  // here
  planDay.consumedMacros = calculatedMacros;
  planDay.markModified('meals');
  await planDay.save();
};

const updatePlanDayMeal = async (planId, body) => {
  const { mealId, ingredient, isAdd } = body;

  // eslint-disable-next-line no-use-before-define
  const { planDay, activeMeal, macroGroup, ingredientIndex, isLastIngredint } = await getMealAndIngredientInfo(
    planId,
    mealId,
    ingredient,
  );

  const macroDiff = updateIngredient(macroGroup, ingredientIndex, ingredient, isAdd);

  // eslint-disable-next-line no-unused-expressions, @typescript-eslint/no-unused-expressions
  isLastIngredint
    ? (activeMeal.macros = { cal: 0, carb: 0, pro: 0, fat: 0 })
    : updateMealMacros(activeMeal, macroDiff, isAdd);

  planDay.consumedMacros = calcConsumedMacros(planDay.meals);
  // here
  planDay.markModified('meals');
  await planDay.save();
};

const getMealAndIngredientInfo = async (planId, mealId, ingredient) => {
  // Step 1: check if plan and meal exist
  const planDay = await PlanDay.findById(planId);
  if (!planDay) throw new ApiError(httpStatus.NOT_FOUND, 'Plan not found');

  // Step 2: Find the meal to update
  // eslint-disable-next-line no-shadow
  const meal = planDay.meals.find((meal) => meal._id.toHexString() === mealId);
  if (!meal) throw new ApiError(httpStatus.NOT_FOUND, 'Meal not found');
  const { activeMeal } = meal;

  // Step 3: Get the macro group based on ingredient type
  const macroGroup = activeMeal.ingredients[ingredient.macroType];

  // Step 4: Check if ingredient already exists in the macro group
  const ingredientIndex = macroGroup.findIndex((ing) => ing.id === ingredient.id);

  const isLastIngredint = ['carb', 'pro', 'fat', 'free'].every((group) => activeMeal.ingredients[group].length === 0);

  return { planDay, activeMeal, macroGroup, ingredientIndex, isLastIngredint };
};

// DELETE
const deletePlanDayMeal = async (planId, mealId) => {
  const planDay = await PlanDay.findById(planId);
  if (!planDay) throw new ApiError(httpStatus.NOT_FOUND, 'Plan not found');

  planDay.meals = planDay.meals.filter((meal) => meal._id.toHexString() !== mealId);
  planDay.consumedMacros = calcConsumedMacros(planDay.meals);
  // here
  await planDay.save();
};

module.exports = {
  switchMeal,
  changeAllMeals,
  initCustomMeal,
  toggleMealMode,
  submitMealWithAi,
  updatePlanDayMeal,
  deletePlanDayMeal,
  togglePlanDayMealIngredient,
  addSuggestedMealToPlanDayMeals,
};
