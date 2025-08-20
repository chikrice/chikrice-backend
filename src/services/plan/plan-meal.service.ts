import httpStatus from 'http-status';

import ApiError from '@/utils/ApiError';
import { Ingredient, Plan } from '@/models';

import { recalcPlanConsumedMacros } from './plan-helpers';
import {
  getMealById,
  calcMealMacros,
  getIngredientArray,
  findIngredientIndex,
  buildPortionedIngredient,
  calcDefaultPortionQty,
  getMealRecommendedMacros,
  getMilestonePlansForSuggestions,
} from './plan-meal-helpers';

import type { Meal } from '@/types';
import type { GetMealSuggestionsDTO, TogglePlanMealIngredientDTO } from '@/validations/plan.validation';

// -------------------------------------

// ============================================
// MEAL CREATION
// ============================================
export const createMeal = async (planId: string): Promise<void> => {
  const plan = await Plan.findById(planId);
  if (!plan) throw new ApiError(httpStatus.NOT_FOUND, 'Plan not found');

  const number = plan.meals.length + 1;
  const recommendedMacros = getMealRecommendedMacros(plan);
  const newMeal = {
    number,
    recommendedMacros,
  };

  plan.meals.push(newMeal);
  plan.markModified('meals');
  await plan.save();
};

export const addSuggestedMealToPlanMeals = async (planId: string): Promise<void> => {
  // TODO: Implement adding suggested meal logic
  const plan = await Plan.findById(planId);
  if (!plan) throw new ApiError(httpStatus.NOT_FOUND, 'Plan not found');

  // Add logic to add suggested meal
};

export const copyMeals = async (planId: string, body: { sourcePlanId: string }): Promise<void> => {
  const { sourcePlanId } = body;
  const sourcePlan = await Plan.findById(sourcePlanId).lean();
  const targetPlan = await Plan.findById(planId);

  if (!sourcePlan) throw new ApiError(httpStatus.NOT_FOUND, 'Source plan not found');
  if (!targetPlan) throw new ApiError(httpStatus.NOT_FOUND, 'Target plan not found');

  // TODO: Implement meal copying logic
  // targetPlan.meals = sourcePlan.meals;
  // await targetPlan.save();
};

// ============================================
// MEAL UPDATE
// ============================================
export const updatePlanMeal = async (planId: string): Promise<void> => {
  // TODO: Implement meal update logic
  const plan = await Plan.findById(planId);
  if (!plan) throw new ApiError(httpStatus.NOT_FOUND, 'Plan not found');

  // Add logic to update meal ingredients
};

export const toggleMealMode = async (planId: string): Promise<void> => {
  // TODO: Implement meal mode toggle logic
  const plan = await Plan.findById(planId);
  if (!plan) throw new ApiError(httpStatus.NOT_FOUND, 'Plan not found');

  // Add logic to toggle meal mode
};

// ============================================
// TOGGLE THE MEAL INGREDIENT ON AND OFF
// ============================================
export const togglePlanMealIngredient = async (planId: string, data: TogglePlanMealIngredientDTO): Promise<void> => {
  const { mealId, ingredientId } = data;

  const plan = await Plan.findById(planId);
  if (!plan) throw new ApiError(httpStatus.NOT_FOUND, 'Plan not found');

  const { meal } = getMealById(plan, mealId);
  if (!meal) throw new ApiError(httpStatus.NOT_FOUND, 'Meal not found');

  const ingredient = await Ingredient.findById(ingredientId);
  if (!ingredient) throw new ApiError(httpStatus.NOT_FOUND, 'Ingredient not found');

  const macroType = ingredient?.macroType as keyof Meal['ingredients'];

  if (!macroType) throw new ApiError(httpStatus.BAD_REQUEST, 'Ingredient macroType is required');

  const macroArr = getIngredientArray(meal, macroType);

  const idx = findIngredientIndex(macroArr, ingredientId);

  if (idx !== -1) {
    // remove
    macroArr.splice(idx, 1);
  } else {
    // add with default portion based on recommendedMacros
    const qty = calcDefaultPortionQty(ingredient, meal.recommendedMacros);
    const portioned = buildPortionedIngredient(ingredient, qty);
    macroArr.push(portioned);
  }

  meal.macros = calcMealMacros(meal);
  plan.consumedMacros = recalcPlanConsumedMacros(plan.meals);

  plan.markModified('meals');
  await plan.save();
};

// ============================================
// ADD INGREDIENTS WITH AI
// ============================================
export const submitMealWithAi = async (planId: string): Promise<void> => {
  // TODO: Implement AI meal submission logic
  const plan = await Plan.findById(planId);
  if (!plan) throw new ApiError(httpStatus.NOT_FOUND, 'Plan not found');

  // Add AI integration logic
};

// ============================================
// MEAL DELETE
// ============================================
export const deletePlanMeal = async (planId: string): Promise<void> => {
  // TODO: Implement meal deletion logic
  const plan = await Plan.findById(planId);
  if (!plan) throw new ApiError(httpStatus.NOT_FOUND, 'Plan not found');

  // Add logic to delete a meal
};

// ============================================
// MEAL SUGGESTIONS
// ============================================
export const getMealSuggestions = async (planId: string, data: GetMealSuggestionsDTO): Promise<Meal[]> => {
  const { roadmapId, mealNumber } = data;

  const milestonePlans = await getMilestonePlansForSuggestions(roadmapId);

  const currentPlanIndex = milestonePlans.findIndex((plan) => plan.planId.toString() === planId);
  if (currentPlanIndex === -1) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Plan not found in milestone');
  }

  // Get previous plans for suggestions (up to 3 previous plans)
  const previousPlansCount = Math.min(3, currentPlanIndex);
  const previousPlans = milestonePlans.slice(Math.max(0, currentPlanIndex - previousPlansCount), currentPlanIndex);

  // Extract plan IDs from previous plans
  const previousPlanIds = previousPlans.map((plan) => plan.planId);

  // Fetch previous Plan documents to access their meals
  const previousPlanDocuments = await Plan.find({ _id: { $in: previousPlanIds } }).lean();

  // Collect unique meal suggestions
  const mealSuggestions: Meal[] = [];
  const seenMealIds = new Set<string>();

  previousPlanDocuments.forEach((planDoc) => {
    const { meals } = planDoc;

    if (Array.isArray(meals) && meals[mealNumber - 1]) {
      const meal = meals[mealNumber - 1];

      // Ensure meal exists and hasn't been seen before
      if (meal && meal._id && !seenMealIds.has(meal._id.toString())) {
        mealSuggestions.unshift(meal); // Add to beginning for chronological order
        seenMealIds.add(meal._id.toString());
      }
    }
  });

  return mealSuggestions;
};
