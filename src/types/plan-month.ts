import type { Types } from 'mongoose';

export interface Day {
  id: Types.ObjectId | null;
  name: string;
  date: Date;
  number: number;
}

export interface Week {
  weekNumber: number;
  startDate: Date;
  endDate: Date;
  days: Day[];
}

export interface PlanMonthType {
  userId: Types.ObjectId;
  roadmapId: Types.ObjectId;
  milestoneId: Types.ObjectId;
  subscriptionId: Types.ObjectId | null;
  subscriptionType: 'free' | 'premium' | 'flexible';
  startDate: Date;
  endDate: Date;
  totalDays: number;
  totalWeeks: number;
  data: Week[];
}

export interface MealsCount {
  meals: number;
  snacks: number;
}

export interface PlanPeriod {
  totalDays: number;
  totalWeeks: number;
}
