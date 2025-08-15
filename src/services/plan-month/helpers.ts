import httpStatus from 'http-status';
import { differenceInCalendarDays, addDays } from 'date-fns';

import ApiError from '@/utils/ApiError';

import type { Types } from 'mongoose';
import type { RoadmapDoc } from '@/models/roadmap';
import type { Milestone, Week, Day, MealCounts, PlanPeriod } from '@/types';

// ============================================
// CONSTANTS
// ============================================
const DAYS_PER_WEEK = 7;

const DAY_NAMES = ['saturday', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday'] as const;

const MEAL_THRESHOLDS = {
  LOW: 1500,
  MEDIUM: 2500,
  HIGH: 3000,
  VERY_HIGH: 3500,
} as const;

const MEAL_COUNTS: Record<string, MealCounts> = {
  LOW: { meals: 3, snacks: 1 },
  MEDIUM: { meals: 3, snacks: 2 },
  HIGH: { meals: 4, snacks: 2 },
  VERY_HIGH: { meals: 4, snacks: 3 },
  EXTREME: { meals: 5, snacks: 3 },
} as const;

// ============================================
// PURE FUNCTIONS
// ============================================

/**
 * Calculates plan period from start and end dates
 */
export const getPlanMonthPeriod = (startDate: Date, endDate: Date): PlanPeriod => {
  const totalDays = differenceInCalendarDays(new Date(endDate), new Date(startDate));

  if (totalDays <= 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid date range');
  }

  return {
    totalDays,
    totalWeeks: Math.ceil(totalDays / DAYS_PER_WEEK),
  };
};

/**
 * Calculates meal counts based on calories (pure function)
 */
const calculateMealCounts = (calories: number): MealCounts => {
  if (calories <= MEAL_THRESHOLDS.LOW) return MEAL_COUNTS.LOW;
  if (calories <= MEAL_THRESHOLDS.MEDIUM) return MEAL_COUNTS.MEDIUM;
  if (calories <= MEAL_THRESHOLDS.HIGH) return MEAL_COUNTS.HIGH;
  if (calories <= MEAL_THRESHOLDS.VERY_HIGH) return MEAL_COUNTS.VERY_HIGH;
  return MEAL_COUNTS.EXTREME;
};

/**
 * Validates roadmap data
 */
export const validateRoadmap = (roadmap: RoadmapDoc | null) => {
  if (!roadmap) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Roadmap not found');
  }

  const { onGoingMonth, milestones } = roadmap;

  if (!milestones || milestones.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'No milestones found');
  }

  if (onGoingMonth < 1 || onGoingMonth > milestones.length) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid ongoing month');
  }

  return roadmap;
};

/**
 * Extracts current milestone from roadmap
 */
export const extractCurrentMilestone = (roadmap: RoadmapDoc) => {
  const { onGoingMonth, milestones } = roadmap;
  return milestones[onGoingMonth - 1];
};

/**
 * Creates plan day data object (pure function)
 */
const createPlanDayData = (
  dayIndex: number,
  date: Date,
  dayNumber: number,
  milestone: Milestone,
  userId: Types.ObjectId,
  mealCounts: MealCounts,
) => ({
  userId,
  number: dayNumber,
  name: DAY_NAMES[dayIndex],
  subscriptionType: 'free' as const,
  date,
  calories: milestone.targetCalories,
  macrosRatio: milestone.macrosRatio,
  mealsCount: mealCounts.meals,
  snacksCount: mealCounts.snacks,
});

/**
 * Generates day data for a specific day
 */
const generateDayData = (
  dayIndex: number,
  date: Date,
  dayNumber: number,
  milestone: Milestone,
  userId: Types.ObjectId,
  mealCounts: MealCounts,
): Day => ({
  id: null,
  name: DAY_NAMES[dayIndex],
  date,
  number: dayNumber,
});

/**
 * Generates week data for a specific week
 */
const generateWeekData = (
  weekNumber: number,
  period: PlanPeriod,
  milestone: Milestone,
  userId: Types.ObjectId,
  mealCounts: MealCounts,
): Week => {
  const startDate = addDays(milestone.startDate, (weekNumber - 1) * DAYS_PER_WEEK);
  const endDate = addDays(startDate, DAYS_PER_WEEK - 1);

  const daysInWeek = Math.min(DAYS_PER_WEEK, period.totalDays - (weekNumber - 1) * DAYS_PER_WEEK);

  const days = Array.from({ length: daysInWeek }, (_, dayIndex) => {
    const dayNumber = (weekNumber - 1) * DAYS_PER_WEEK + dayIndex + 1;
    const date = addDays(startDate, dayIndex);

    return generateDayData(dayIndex, date, dayNumber, milestone, userId, mealCounts);
  });

  return {
    weekNumber,
    startDate,
    endDate,
    days,
  };
};

/**
 * Generates all weeks data
 */
export const generatePlanMonthWeeksData = (
  period: PlanPeriod,
  milestone: Milestone,
  userId: Types.ObjectId,
): Week[] => {
  const mealCounts = calculateMealCounts(milestone.targetCalories);

  return Array.from({ length: period.totalWeeks }, (_, weekIndex) => {
    const weekNumber = weekIndex + 1;
    return generateWeekData(weekNumber, period, milestone, userId, mealCounts);
  });
};

/**
 * Extracts all plan day data for bulk insert
 */
export const extractPlanDaysData = (weeksData: Week[]): any[] =>
  weeksData.flatMap((week) => week.days.map((day) => day.planDayData));

/**
 * Updates weeks data with actual plan day IDs
 */
export const updateWeeksWithPlanDayIds = (weeksData: Week[], createdPlanDays: any[]): Week[] => {
  let planDayIndex = 0;

  return weeksData.map((week) => ({
    ...week,
    days: week.days.map((day) => {
      const updatedDay = { ...day };

      if (createdPlanDays[planDayIndex]) {
        updatedDay.id = createdPlanDays[planDayIndex]._id;
        delete updatedDay.planDayData; // Clean up temporary data
      }

      planDayIndex++;
      return updatedDay;
    }),
  }));
};

/**
 * Creates plan object
 */
export const createPlanObject = (
  userId: Types.ObjectId,
  roadmapId: string,
  milestoneId: Types.ObjectId,
  period: PlanPeriod,
  startDate: Date,
  endDate: Date,
  data: Week[],
) => ({
  userId,
  roadmapId,
  milestoneId,
  totalDays: period.totalDays,
  totalWeeks: period.totalWeeks,
  startDate,
  endDate,
  data,
});

/**
 * Updates roadmap with plan ID
 */
export const updateRoadmapWithPlanId = async (
  roadmapId: string,
  onGoingMonth: number,
  planId: Types.ObjectId,
  session?: any,
) => {
  const { Roadmap } = await import('@/models');

  await Roadmap.findByIdAndUpdate(
    roadmapId,
    {
      $set: {
        [`milestones.${onGoingMonth - 1}.planId`]: planId,
      },
    },
    { session },
  );
};
