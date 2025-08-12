import { z } from 'zod';

import { zObjectId } from './custom.validation';

// -------------------------------------

export const createPlan = {
  body: z.object({
    roadmapId: zObjectId,
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

export const getMealSuggestions = {
  params: z.object({
    planId: zObjectId,
  }),
  query: z.object({
    planDayId: zObjectId,
    mealNumber: z.number().int().min(1),
  }),
};

export type GetMealSuggestionsDTO = z.infer<typeof getMealSuggestions.query>;
