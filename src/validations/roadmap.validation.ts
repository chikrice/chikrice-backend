import { z } from 'zod';

import { zObjectId } from './custom.validation';

// -------------------------------------

export const createRoadmap = {
  body: z.object({
    userId: zObjectId,
    age: z.number().int().min(0).max(120),
    gender: z.enum(['male', 'female']),
    height: z.number().int().min(0),
    startWeight: z.number().int().min(0),
    targetWeight: z.number().int().min(0),
    activityLevel: z.number().int().min(1).max(5),
    isWeightLifting: z.boolean(),
    goalAchievementSpeed: z.enum(['slow', 'recommended', 'fast']),
  }),
};

export type CreateRoadmapDTO = z.infer<typeof createRoadmap.body>;

export const queryRoadmaps = {
  query: z
    .object({
      sortBy: z.string(),
      limit: z.number().int().min(1),
      page: z.number().int().min(1),
    })
    .partial(),
};

export const getRoadmap = {
  params: z.object({
    roadmapId: zObjectId,
  }),
};

export const updateRoadmapMilestone = {
  body: z.object({
    roadmapId: zObjectId,
    milestoneId: zObjectId,
    data: z.object({
      planId: zObjectId,
      startWeight: z.number().int().min(0),
      targetWeight: z.number().int().min(0),
      baseCalories: z.number().int().min(0),
      targetCalories: z.number().int().min(0),
    }),
  }),
};

export type UpdateRoadmapMilestoneDTO = z.infer<typeof updateRoadmapMilestone.body>;

export const updateRoadmap = {
  params: z.object({
    roadmapId: zObjectId,
  }),
  body: z.object({
    userId: zObjectId,
    currentWeight: z.number().int().min(0),
    newTargetWeight: z.number().int().min(0),
  }),
};

export type UpdateRoadmapDTO = z.infer<typeof updateRoadmap.body>;

export const updateActivityLog = {
  params: z.object({
    roadmapId: zObjectId,
  }),
  body: z.object({
    consumedCalories: z.number().min(0),
    targetCalories: z.number().min(0),
    index: z.number().int().min(0),
  }),
};

export type UpdateActivityLogDTO = z.infer<typeof updateActivityLog.body>;
