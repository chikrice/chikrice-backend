import { roundToDecimal } from '@/utils/numbers';

import type { GoalSpeed } from 'chikrice-types';
import type { CreateRoadmapDTO } from '@/validations/roadmap.validation';

// -------------------------------------

const LOG_BASE = 0.76;
const CALORIES_PER_KG = 7700;
const DAYS_PER_MONTH = 30;
const CALORIE_INCREMENT = 100;

// -------------------------------------

type WeightProgression = {
  month: number;
  startWeight: number;
  targetWeight: number;
  weightChange: number;
  changePoint: null;
};

// ============================================
// CALCULATE WEIGHT CHANGE
// ============================================
export const calculateWeightChange = (startWeight: number, targetWeight: number) =>
  Math.abs(startWeight - targetWeight);

// ============================================
// CALCULATE INITIAL CALORIES ADJUSTMENT
// ============================================
export const calculateInitialCaloriesAdjustment = (goalAchievementSpeed: GoalSpeed) => {
  switch (goalAchievementSpeed) {
    case 'slow':
      return 200;

    case 'recommended':
      return 400;

    case 'fast':
      return 600;

    default:
      return 400;
  }
};

// ============================================
// CALCULATE TOTAL DAYS
// ============================================
export const calculateTotalDays = (totalMonths: number): number => totalMonths * DAYS_PER_MONTH;

// ============================================
// CALCULATE MONTHLY CALORIE ADJUSTMENT
// ============================================
export const calculateMonthlyCalorieAdjustment = (
  weightChange: number,
  isGainWeight: boolean,
  initialCalorieAdjustment: number,
): number[] => {
  if (weightChange <= 0) {
    return [];
  }

  const calorieAdjustmentFactor = isGainWeight ? 1 : -1;
  const totalCaloriesNeeded = weightChange * CALORIES_PER_KG;

  // For small weight changes, a single adjustment is enough
  if (weightChange <= 2) {
    return [initialCalorieAdjustment * calorieAdjustmentFactor];
  }

  const calorieAdjustments: number[] = [];
  let remainingCalories = totalCaloriesNeeded;
  let currentCalorieAdjustment = initialCalorieAdjustment;

  while (remainingCalories > 0) {
    const monthlyCalories = currentCalorieAdjustment * DAYS_PER_MONTH;
    const adjustedCalories = currentCalorieAdjustment * calorieAdjustmentFactor;

    calorieAdjustments.push(adjustedCalories);
    remainingCalories -= monthlyCalories;
    currentCalorieAdjustment += CALORIE_INCREMENT;
  }

  return calorieAdjustments;
};

// ============================================
// GET WEIGHT PROGRESS RATIO
// ============================================
const getWeightProgressRatio = (month: number, totalMonths: number) =>
  Math.log(month + 1 + LOG_BASE) / Math.log(totalMonths + LOG_BASE);

// ============================================
// GENERATE WEIGHT PROGRESS RATIOS
// ============================================
export const generateWeightProgressRatios = (totalMonths: number): number[] =>
  Array.from({ length: totalMonths }, (_, month) => getWeightProgressRatio(month, totalMonths));

// ============================================
// CALCULATE WEIGHT PROGRESSION
// ============================================
export const calculateWeightProgression = (
  input: CreateRoadmapDTO,
  weightChange: number,
  isGainWeight: boolean,
  ratios: number[],
): WeightProgression[] => {
  const { startWeight, targetWeight } = input;

  if (weightChange <= 2) {
    const diff = roundToDecimal(targetWeight - startWeight);
    return [{ month: 1, startWeight, targetWeight, weightChange: diff, changePoint: null }];
  }

  const multiplyFactor = isGainWeight ? 1 : -1;
  const progression: WeightProgression[] = [];

  ratios.forEach((ratio, index) => {
    const monthWeightChange = weightChange * ratio;
    const currentWeight = startWeight + multiplyFactor * monthWeightChange;
    const target = roundToDecimal(currentWeight);

    // For the first month, use startWeight as the starting point
    const previousTargetWeight = index === 0 ? startWeight : progression[index - 1].targetWeight;
    const diff = roundToDecimal(target - previousTargetWeight);

    progression.push({
      month: index + 1,
      startWeight: previousTargetWeight,
      targetWeight: target,
      weightChange: diff,
      changePoint: null,
    });
  });

  return progression;
};

// ============================================
// CALCULATE ROADMAP PERIOD
// ============================================
export const calculateRoadmapPeriod = (totalDays: number): { startDate: Date; endDate: Date } => {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const endDate = new Date(today);
  endDate.setDate(today.getDate() + totalDays);

  return {
    startDate: today,
    endDate,
  };
};
