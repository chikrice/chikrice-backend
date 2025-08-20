import httpStatus from 'http-status';

import ApiError from '@/utils/ApiError';
import { Plan, User, Roadmap } from '@/models';

import {
  calculateMealsCount,
  calculateTargetMacros,
  generateDateArray,
  createPlanData,
  createPlanRef,
} from './plan-helpers';

import type { PlanReference } from '@/types';
import type { CreatePlansDTO, GetMilestonePlansDTO } from '@/validations/plan.validation';

// ============================================
// PLAN QUERY
// ============================================
export const getMilestonePlans = async (data: GetMilestonePlansDTO): Promise<PlanReference[] | null> => {
  const { roadmapId, milestoneId } = data;
  const roadmap = await Roadmap.findById(roadmapId);
  if (!roadmap) throw new ApiError(httpStatus.NOT_FOUND, 'Roadmap not found');

  const milestone = roadmap.milestones.find((m) => m._id?.toString() === milestoneId);
  if (!milestone) throw new ApiError(httpStatus.NOT_FOUND, 'Milestone not found in roadmap');

  return milestone.plans;
};

export const getPlan = async (id: string) => {
  const plan = await Plan.findById(id);
  if (!plan) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Plan not found');
  }
  return plan;
};

// ============================================
// PLAN CREATION
// ============================================
export const createPlans = async (input: CreatePlansDTO): Promise<PlanReference[]> => {
  const { startDate, endDate, macrosRatio, targetCalories, roadmapId, milestoneId } = input;

  const roadmap = await Roadmap.findById(roadmapId);

  if (!roadmap) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Roadmap not found');
  }

  const milestone = roadmap.milestones.find((m) => m._id?.toString() === milestoneId);

  if (!milestone) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Milestone not found in roadmap');
  }

  const targetMacros = calculateTargetMacros(macrosRatio, targetCalories);

  const { meals: mealsCount, snacks: snacksCount } = calculateMealsCount(targetCalories);

  const dateArray = generateDateArray(startDate, endDate);

  const plans = await Promise.all(
    dateArray.map(async (date, index) => {
      const dayNumber = index + 1;
      const planData = createPlanData(date, dayNumber, targetMacros, mealsCount, snacksCount);
      return Plan.create(planData);
    }),
  );

  const planRefs = dateArray.map((date, index) => createPlanRef(plans[index]._id.toString(), date, index + 1));

  milestone.plans = planRefs;
  roadmap.markModified('milestones');
  await roadmap.save();

  return planRefs;
};

// ============================================
// PLAN DELETE
// ============================================
export const deletePlan = async (planId: string) => {
  const plan = await Plan.findById(planId);
  if (!plan) throw new ApiError(httpStatus.NOT_FOUND, 'Plan not found');

  // TODO: Implement plan deletion logic
  // This might involve clearing meals or other cleanup
  await plan.save();
};

// ============================================
// PLAN UPDATE
// ============================================
export const toggleSavePlan = async (planId: string, body: { userId: string }) => {
  const { userId } = body;

  const user = await User.findById(userId);
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'User not found');

  // TODO: Implement plan update logic

  await user.save();
};
