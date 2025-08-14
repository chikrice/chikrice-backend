import {
  calculateMacrosRatio,
  calculateMilestoneCalories,
  getMilestonePeriod,
  calculateCalorieAdjustment,
} from './helpers';

import type { Milestone, Overview } from '@/types/roadmap';
import type { CreateRoadmapDTO } from '@/validations/roadmap.validation';

// -------------------------------------

export const createRoadmapMilestone = (input: CreateRoadmapDTO, overview: Overview, index: number): Milestone => {
  const { weightProgression, monthlyCalorieAdjustment, totalMonths } = overview;
  const { startWeight, targetWeight } = weightProgression[index];

  const { startDate, endDate } = getMilestonePeriod(overview.startDate, index);

  const { baseCalories, targetCalories } = calculateMilestoneCalories(
    input,
    startWeight,
    monthlyCalorieAdjustment[index],
  );

  const macrosRatio = calculateMacrosRatio(input, index + 1, totalMonths);

  const calorieAdjustment = calculateCalorieAdjustment(monthlyCalorieAdjustment[index]);

  const milestone = {
    plans: null,
    month: index + 1,
    startWeight,
    targetWeight,
    startDate,
    endDate,
    baseCalories,
    targetCalories,
    macrosRatio,
    calorieAdjustment,
    changePoint: null,
  };

  return milestone;
};

export const createRoadmapMilestones = (input: CreateRoadmapDTO, overview: Overview): Milestone[] => {
  const { totalMonths } = overview;

  const milestones = Array.from({ length: totalMonths }, (_, index) => createRoadmapMilestone(input, overview, index));

  return milestones;
};
