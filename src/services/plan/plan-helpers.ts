import type { Macros, MacrosRatio, Meal, MealsCount, PlanType } from 'chikrice-types';

// -------------------------------------

const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;

const MEAL_THRESHOLDS = {
  LOW: 1500,
  MEDIUM: 2500,
  HIGH: 3000,
  VERY_HIGH: 3500,
} as const;

const MEAL_COUNTS: Record<string, MealsCount> = {
  LOW: { meals: 3, snacks: 1 },
  MEDIUM: { meals: 3, snacks: 2 },
  HIGH: { meals: 4, snacks: 2 },
  VERY_HIGH: { meals: 4, snacks: 3 },
  EXTREME: { meals: 5, snacks: 3 },
} as const;

const MACRO_CALORIE = {
  CARB: 4,
  PRO: 4,
  FAT: 9,
} as const;

// ============================================
// DATE UTILITIES
// ============================================
export const generateDateRange = (startDate: string, endDate: string): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const timeDiff = end.getTime() - start.getTime();

  return Math.floor(timeDiff / MILLISECONDS_PER_DAY);
};

export const generateDateArray = (startDate: string, endDate: string): Date[] => {
  const start = new Date(startDate);
  const daysDiff = generateDateRange(startDate, endDate);

  return Array.from({ length: daysDiff }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    return date;
  });
};

export const formatDayName = (date: Date): string => date.toLocaleDateString('en-US', { weekday: 'long' });

// ============================================
// MACRO CALCULATIONS
// ============================================
export const calculateTargetMacros = (ratio: MacrosRatio, calories: number): Macros => {
  const { carb, pro, fat } = ratio;

  const carbCalories = (carb / 100) * calories;
  const proCalories = (pro / 100) * calories;
  const fatCalories = (fat / 100) * calories;

  const carbGrams = carbCalories / MACRO_CALORIE.CARB;
  const proGrams = proCalories / MACRO_CALORIE.PRO;
  const fatGrams = fatCalories / MACRO_CALORIE.FAT;

  return {
    cal: +calories.toFixed(),
    carb: +carbGrams.toFixed(),
    pro: +proGrams.toFixed(),
    fat: +fatGrams.toFixed(),
  };
};

// ============================================
// MEAL COUNT CALCULATIONS
// ============================================
export const calculateMealsCount = (calories: number): MealsCount => {
  if (calories <= MEAL_THRESHOLDS.LOW) return MEAL_COUNTS.LOW;
  if (calories <= MEAL_THRESHOLDS.MEDIUM) return MEAL_COUNTS.MEDIUM;
  if (calories <= MEAL_THRESHOLDS.HIGH) return MEAL_COUNTS.HIGH;
  if (calories <= MEAL_THRESHOLDS.VERY_HIGH) return MEAL_COUNTS.VERY_HIGH;
  return MEAL_COUNTS.EXTREME;
};

// ============================================
// PLAN DATA CREATION
// ============================================
export const createPlanData = (
  date: Date,
  dayNumber: number,
  targetMacros: Macros,
  mealsCount: number,
  snacksCount: number,
) => ({
  number: dayNumber,
  mealsCount,
  snacksCount,
  name: formatDayName(date),
  date,
  targetMacros,
  consumedMacros: { cal: 0, pro: 0, carb: 0, fat: 0 },
  meals: [],
});

// ============================================
// CREATE PLAN REFERENCE FOR MILESTONES PLANS
// ============================================
export const createPlanRef = (planId: string, date: Date, dayNumber: number) => ({
  planId,
  name: formatDayName(date),
  date,
  number: dayNumber,
});

// ============================================
// CALCULATE THE PLAN CONSUMED MACROS
// ============================================
export const recalcPlanConsumedMacros = (meals: Meal[]): Macros => {
  const total: Macros = { cal: 0, carb: 0, pro: 0, fat: 0 };

  meals.forEach((meal) => {
    total.cal += meal.macros?.cal || 0;
    total.carb += meal.macros?.carb || 0;
    total.pro += meal.macros?.pro || 0;
    total.fat += meal.macros?.fat || 0;
  });

  return total;
};
