import { roundToDecimal } from '@/utils/numbers';

import { getIsGainWeight } from '../common';

import { ratioSplitRules } from './data';

import type { CalorieAdjustment, MacrosRatio } from '@/types';
import type { CreateRoadmapDTO } from '@/validations/roadmap.validation';

// ============================================
// CALCULATE MILESTONE BASE AND TARGET CALORIES
// ============================================
export const calculateBMR = (startWeight: number, age: number, gender: 'male' | 'female', height: number) => {
  const bmr = {
    male: 10 * startWeight + 6.25 * height - 5 * age + 5,
    female: 10 * startWeight + 6.25 * height - 5 * age - 161,
  };

  return bmr[gender];
};

export const calculateActivityMultiplier = (activityLevel: number) =>
  [1.2, 1.375, 1.55, 1.725, 1.9][activityLevel - 1] ?? 1.2;

export const calculateMilestoneCalories = (
  input: CreateRoadmapDTO,
  startWeight: number,
  calorieAdjustment: number,
): {
  baseCalories: number;
  targetCalories: number;
} => {
  const { age, gender, height, activityLevel } = input;
  const BMR = calculateBMR(startWeight, age, gender, height);
  const activityMultiplier = calculateActivityMultiplier(activityLevel);

  return {
    baseCalories: roundToDecimal(BMR * activityMultiplier, 0),
    targetCalories: roundToDecimal(BMR * activityMultiplier + calorieAdjustment, 0),
  };
};

// ============================================
// GET MILESTONE PERIOD
// ============================================
export const getMilestonePeriod = (startDate: Date, index: number): { startDate: Date; endDate: Date } => {
  const milestoneStart = new Date(startDate);
  milestoneStart.setMonth(milestoneStart.getMonth() + index);

  const milestoneEnd = new Date(milestoneStart);
  milestoneEnd.setMonth(milestoneEnd.getMonth() + 1);

  return {
    startDate: milestoneStart,
    endDate: milestoneEnd,
  };
};

// ============================================
// CALCULATE CALORIE ADJUSTMENT
// ============================================
export const calculateCalorieAdjustment = (calorieAdjustment: number): CalorieAdjustment => ({
  type: calorieAdjustment > 0 ? 'surplus' : 'deficit',
  day: Math.abs(calorieAdjustment),
  month: Math.abs(calorieAdjustment * 30),
});

// ============================================
// CALCULATE MACROS RATIO
// ============================================
export const calculateIncrement = (totalMonths: number): number => {
  if (totalMonths < 7) {
    return 2;
  }
  // '11' is the rounded gap between start and end carb/protein ratios, divided by total months to get monthly increment.
  return 11 / totalMonths;
};

export const calculateMacrosAdjustment = (
  startRatio: number,
  month: number,
  increment: number,
  isGainWeight: boolean,
): number => {
  const adjustment = (month - 1) * increment;
  return isGainWeight ? startRatio + adjustment : startRatio - adjustment;
};

export const getMacrosRatio = (
  start: MacrosRatio,
  end: MacrosRatio,
  config: { month: number; totalMonths: number; isGainWeight: boolean },
): MacrosRatio => {
  const { month, totalMonths, isGainWeight } = config;
  const increment = calculateIncrement(totalMonths);

  let carb = calculateMacrosAdjustment(start.carb, month, increment, isGainWeight);
  let pro = calculateMacrosAdjustment(start.pro, month, increment, !isGainWeight); // Note: protein adjustment is opposite

  if (totalMonths > 6 && month === totalMonths) {
    pro = end.pro;
    carb = end.carb;
  }

  return { carb: Math.round(carb), pro: Math.round(pro), fat: start.fat };
};

export const calculateMacrosRatio = (input: CreateRoadmapDTO, month: number, totalMonths: number): MacrosRatio => {
  const { isWeightLifting, gender, startWeight, targetWeight } = input;

  const isGainWeight = getIsGainWeight(startWeight, targetWeight);
  const goal = isGainWeight ? 'gainWeight' : 'loseWeight';
  const gymStatus = isWeightLifting ? 'gym' : 'noGym';

  const { start, end } = ratioSplitRules[goal][gender][gymStatus];

  const config = { month, totalMonths, isGainWeight };
  const macrosRatio = getMacrosRatio(start, end, config);

  return macrosRatio;
};
