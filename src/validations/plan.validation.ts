import { z } from 'zod';

import { zObjectId } from './custom.validation';

// -------------------------------------

export const createPlan = {
  body: z.object({
    userId: zObjectId,
    // Add other fields as needed for plan creation
  }),
};

export type CreatePlanDTO = z.infer<typeof createPlan.body>;

export const queryPlans = {
  query: z
    .object({
      sortBy: z.string(),
      limit: z.number().int().min(1),
      page: z.number().int().min(1),
    })
    .partial(),
};

export const getPlan = {
  params: z.object({
    planId: zObjectId,
  }),
};

export const deletePlan = {
  params: z.object({
    planId: zObjectId,
  }),
};

export const toggleSavePlan = {
  params: z.object({
    planId: zObjectId,
  }),
  body: z.object({
    userId: zObjectId,
  }),
};

export const toggleMealMode = {
  params: z.object({
    planId: zObjectId,
  }),
  body: z.object({
    mealId: zObjectId,
    userId: zObjectId,
    mode: z.enum(['view', 'edit']),
    notes: z.string().optional(),
  }),
};

export const togglePlanMealIngredient = {
  params: z.object({
    planId: zObjectId,
  }),
  body: z.object({
    mealId: zObjectId,
    userId: zObjectId,
    ingredient: z.object({}).passthrough(), // Allow any object structure
  }),
};

export const initCustomMeal = {
  params: z.object({
    planId: zObjectId,
  }),
};

export const updatePlanMeal = {
  params: z.object({
    planId: zObjectId,
  }),
  body: z.object({
    mealId: zObjectId,
    ingredient: z.object({}).passthrough(),
    isAdd: z.boolean(),
  }),
};

export const deletePlanMeal = {
  params: z.object({
    planId: zObjectId,
  }),
  query: z.object({
    mealId: zObjectId,
  }),
};

export const submitMealWithAi = {
  params: z.object({
    planId: zObjectId,
  }),
  body: z.object({
    prompt: z.string(),
    mealId: zObjectId,
  }),
};

export const addSuggestedMealToPlanMeals = {
  params: z.object({
    planId: zObjectId,
  }),
  body: z.object({
    meal: z.object({}).passthrough(),
  }),
};

export const copyMeals = {
  params: z.object({
    planId: zObjectId,
  }),
  body: z.object({
    sourcePlanId: z.string(),
  }),
};

export const chikricePlanGenerator = {
  params: z.object({
    planId: zObjectId,
  }),
  body: z.object({
    mealsCount: z.number(),
    snacksCount: z.number(),
    userWeight: z.number(),
    userGoal: z.enum(['loseWeight', 'gainWeight']),
    ingredients: z.object({
      carbs: z.array(z.any()),
      proteins: z.array(z.any()),
      fats: z.array(z.any()),
      fruits: z.array(z.any()),
      dairy: z.array(z.any()).optional(),
      snacks: z.array(z.any()).optional(),
    }),
  }),
};

export type ToggleMealModeDTO = z.infer<typeof toggleMealMode.body>;
export type TogglePlanMealIngredientDTO = z.infer<typeof togglePlanMealIngredient.body>;
export type UpdatePlanMealDTO = z.infer<typeof updatePlanMeal.body>;
export type SubmitMealWithAiDTO = z.infer<typeof submitMealWithAi.body>;
export type AddSuggestedMealToPlanMealsDTO = z.infer<typeof addSuggestedMealToPlanMeals.body>;
export type CopyMealsDTO = z.infer<typeof copyMeals.body>;
export type ChikricePlanGeneratorDTO = z.infer<typeof chikricePlanGenerator.body>;
