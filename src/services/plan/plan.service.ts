import httpStatus from 'http-status';

import ApiError from '@/utils/ApiError';
import { Plan, User, Roadmap } from '@/models';

import {
  calculateMealsCount,
  calculateTargetMacros,
  generateDateArray,
  createPlanData,
  createPlanRef,
} from './helpers';

import type { PlanDoc } from '@/models/plan';
import type { CreatePlanDTO, CreatePlansDTO } from '@/validations/plan.validation';

// ============================================
// PLAN QUERY
// ============================================
export const queryPlans = async (options: Record<string, unknown>) => Plan.paginate(null, options);

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
export const createPlan = async (planData: CreatePlanDTO) => {
  // TODO: Implement plan creation logic
  // This will need to be adapted based on your new plan model structure
  const plan = await Plan.create(planData);
  return plan;
};

// ============================================
// MAIN IMPLEMENTATION
// ============================================
export const createPlans = async (input: CreatePlansDTO): Promise<PlanDoc[]> => {
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

  return plans;
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

// ============================================
// MEAL OPERATIONS

// ============================================
// MEAL CREATION
// ============================================
export const initMeal = async (planId: string) => {
  // TODO: Implement custom meal initialization
  const plan = await Plan.findById(planId);
  if (!plan) throw new ApiError(httpStatus.NOT_FOUND, 'Plan not found');

  // Add logic to initialize a custom meal
};

export const addSuggestedMealToPlanMeals = async (planId: string) => {
  // TODO: Implement adding suggested meal logic
  const plan = await Plan.findById(planId);
  if (!plan) throw new ApiError(httpStatus.NOT_FOUND, 'Plan not found');

  // Add logic to add suggested meal
};

export const copyMeals = async (planId: string, body: { sourcePlanId: string }) => {
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
export const updatePlanMeal = async (planId: string) => {
  // TODO: Implement meal update logic
  const plan = await Plan.findById(planId);
  if (!plan) throw new ApiError(httpStatus.NOT_FOUND, 'Plan not found');

  // Add logic to update meal ingredients
};

export const toggleMealMode = async (planId: string) => {
  // TODO: Implement meal mode toggle logic
  const plan = await Plan.findById(planId);
  if (!plan) throw new ApiError(httpStatus.NOT_FOUND, 'Plan not found');

  // Add logic to toggle meal mode
};

export const togglePlanMealIngredient = async (planId: string) => {
  // TODO: Implement ingredient toggle logic
  const plan = await Plan.findById(planId);
  if (!plan) throw new ApiError(httpStatus.NOT_FOUND, 'Plan not found');

  // Add logic to toggle ingredients
};

export const submitMealWithAi = async (planId: string) => {
  // TODO: Implement AI meal submission logic
  const plan = await Plan.findById(planId);
  if (!plan) throw new ApiError(httpStatus.NOT_FOUND, 'Plan not found');

  // Add AI integration logic
};

// ============================================
// MEAL DELETE
// ============================================
export const deletePlanMeal = async (planId: string) => {
  // TODO: Implement meal deletion logic
  const plan = await Plan.findById(planId);
  if (!plan) throw new ApiError(httpStatus.NOT_FOUND, 'Plan not found');

  // Add logic to delete a meal
};
