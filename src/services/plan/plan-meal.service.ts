import httpStatus from 'http-status';

import ApiError from '@/utils/ApiError';
import { Plan, Ingredient } from '@/models';

import { recalcPlanConsumedMacros } from './plan-helpers';
import {
  getMealById,
  getIngredientArray,
  findIngredientIndex,
  getMealRecommendedMacros,
  getMilestonePlansForSuggestions,
  getUserPortionPreference,
  calculateOptimalPortionSize,
  removeIngredientFromMeal,
  addIngredientToMeal,
  updateMealMacros,
} from './plan-meal-helpers';

import type { Meal } from 'chikrice-types';
import type {
  GetMealSuggestionsDTO,
  TogglePlanMealIngredientDTO,
  ToggleMealModeDTO,
  AddSuggestedMealToPlanMealsDTO,
} from '@/validations/plan.validation';

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
    ingredients: { carb: [], pro: [], fat: [], free: [], custom: [] },
  };

  plan.meals.push(newMeal);
  plan.markModified('meals');
  await plan.save();
};

export const addSuggestedMealToPlanMeals = async (
  planId: string,
  data: AddSuggestedMealToPlanMealsDTO,
): Promise<void> => {
  const plan = await Plan.findById(planId);
  const { meal } = data;
  if (!plan) throw new ApiError(httpStatus.NOT_FOUND, 'Plan not found');
  plan.meals.push(meal);
  plan.consumedMacros = recalcPlanConsumedMacros(plan.meals);
  plan.markModified('meals');
  await plan.save();
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

// ============================================
// TOGGLE MEAL MODE
// ============================================
export const toggleMealMode = async (planId: string, data: ToggleMealModeDTO): Promise<void> => {
  const { mealId, mode } = data;

  const plan = await Plan.findById(planId);
  if (!plan) throw new ApiError(httpStatus.NOT_FOUND, 'Plan not found');

  const { meal } = getMealById(plan, mealId);
  if (!meal) throw new ApiError(httpStatus.NOT_FOUND, 'Meal not found');

  meal.mode = mode;

  if (mode === 'view') {
    // await updateUserPreferences(userId, { meal });
  }

  plan.markModified('meals');
  await plan.save();
};

// ============================================
// TOGGLE THE MEAL INGREDIENT ON AND OFF
// ============================================
export const togglePlanMealIngredient = async (planId: string, data: TogglePlanMealIngredientDTO): Promise<void> => {
  const { mealId, ingredientId, userId } = data;

  const [plan, ingredient] = await Promise.all([Plan.findById(planId), Ingredient.findById(ingredientId)]);

  if (!plan) throw new ApiError(httpStatus.NOT_FOUND, 'Plan not found');
  if (!ingredient) throw new ApiError(httpStatus.NOT_FOUND, 'Ingredient not found');

  const { meal } = getMealById(plan, mealId);
  if (!meal) throw new ApiError(httpStatus.NOT_FOUND, 'Meal not found');

  const macroType = ingredient?.macroType as keyof Meal['ingredients'];
  if (!macroType) throw new ApiError(httpStatus.BAD_REQUEST, 'Ingredient macroType is required');

  const macroArr = getIngredientArray(meal, macroType);
  const ingredientIndex = findIngredientIndex(macroArr, ingredientId);

  if (ingredientIndex !== -1) {
    removeIngredientFromMeal(macroArr, ingredientIndex);
  } else {
    const userPreference = await getUserPortionPreference(userId, ingredientId, macroType);
    const portionSize = calculateOptimalPortionSize(ingredient, meal, userPreference);

    addIngredientToMeal(macroArr, ingredient, portionSize);
  }

  updateMealMacros(meal);
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
export const deletePlanMeal = async (planId: string, mealId: string): Promise<void> => {
  const plan = await Plan.findById(planId);
  if (!plan) throw new ApiError(httpStatus.NOT_FOUND, 'Plan not found');

  plan.meals = plan.meals.filter((meal) => meal._id!.toString() !== mealId);
  plan.consumedMacros = recalcPlanConsumedMacros(plan.meals);

  await plan.save();
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

  const previousPlanIds = previousPlans.map((plan) => plan.planId);

  const previousPlanDocuments = await Plan.find({ _id: { $in: previousPlanIds } }).lean();

  const mealSuggestions: Meal[] = [];
  const seenMealIds = new Set<string>();

  previousPlanDocuments.forEach((planDoc) => {
    const { meals } = planDoc;
    if (Array.isArray(meals) && meals[mealNumber - 1]) {
      const meal = meals[mealNumber - 1];

      if (meal && meal._id && !seenMealIds.has(meal._id.toString())) {
        mealSuggestions.unshift(meal);
        seenMealIds.add(meal._id.toString());
      }
    }
  });

  return mealSuggestions;
};
