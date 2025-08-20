import { Types } from 'mongoose';

export type GoalSpeed = 'slow' | 'recommended' | 'fast';

export interface ActivityLog {
  date: Date;
  active: boolean;
}

export interface MacrosRatio {
  pro: number;
  carb: number;
  fat: number;
}
export interface CalorieAdjustment {
  type: 'deficit' | 'surplus';
  day: number;
  month: number;
}

interface ChangePoint {
  day: number;
  weight: number;
}

export interface PlanReference {
  planId: Types.ObjectId;
  name: string;
  date: Date;
  number: number;
}

export interface Milestone {
  _id?: Types.ObjectId;
  month: number;
  plans: PlanReference[] | null;
  startWeight: number;
  targetWeight: number;
  baseCalories: number;
  targetCalories: number;
  startDate: Date;
  endDate: Date;
  macrosRatio: MacrosRatio;
  calorieAdjustment: CalorieAdjustment;
  changePoint: ChangePoint | null;
}

interface WeightProgression {
  month: number;
  startWeight: number;
  targetWeight: number;
  weightChange: number;
  changePoint: ChangePoint | null;
}

export interface Overview {
  startWeight: number;
  currentWeight: number | null;
  targetWeight: number;
  startDate: Date;
  endDate: Date;
  totalDays: number;
  totalMonths: number;
  weightProgression: WeightProgression[];
  monthlyCalorieAdjustment: number[];
}

export interface RoadmapType {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  overview: Overview;
  milestones: Milestone[];
  onGoingMonth: number;
  onGoingDay: number;
  activityLog: ActivityLog[];
  isWeightChangeOverLimit: boolean;
}
