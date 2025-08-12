import { getIsGainWeight } from '../common';

import {
  calculateWeightChange,
  calculateInitialCaloriesAdjustment,
  calculateMonthlyCalorieAdjustment,
  calculateTotalDays,
  calculateWeightProgression,
  generateWeightProgressRatios,
  calculateRoadmapPeriod,
} from './helpers';

import type { Overview } from '@/types/roadmap';
import type { CreateRoadmapDTO } from '@/validations/roadmap.validation';

// -------------------------------------

export const createRoadmapOverview = (input: CreateRoadmapDTO): Overview => {
  const { startWeight, targetWeight, goalAchievementSpeed } = input;

  const isGainWeight = getIsGainWeight(startWeight, targetWeight);

  const weightChange = calculateWeightChange(startWeight, targetWeight);

  const initialCalorieAdjustment = calculateInitialCaloriesAdjustment(goalAchievementSpeed);

  const monthlyCalorieAdjustment = calculateMonthlyCalorieAdjustment(
    weightChange,
    isGainWeight,
    initialCalorieAdjustment,
  );

  const totalMonths = monthlyCalorieAdjustment.length;
  const totalDays = calculateTotalDays(totalMonths);

  const weightProgressionRatios = generateWeightProgressRatios(totalMonths);

  const weightProgression = calculateWeightProgression(input, weightChange, isGainWeight, weightProgressionRatios);

  const { startDate, endDate } = calculateRoadmapPeriod(totalDays);

  const overview = {
    startWeight,
    currentWeight: startWeight,
    targetWeight,
    totalDays,
    totalMonths,
    weightProgression,
    startDate,
    endDate,
    monthlyCalorieAdjustment,
  };

  return overview;
};
