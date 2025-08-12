import type { Types } from 'mongoose';
import type { MealPreferences } from './meal-preferences';

export interface UserBase {
  name: string;
  email: string;
  age: number;
  isEmailVerified: boolean;
  picture: string;
  password: string;
  phoneNumber: string | null;
  role: 'user' | 'admin' | 'coach';
  gender: 'male' | 'female' | null;
  registrationMethod: 'google' | 'manual' | 'admin';
}

interface Address {
  name: string;
  fullAddress: string;
  addressType?: 'home' | 'office';
  phoneNumber: string;
  isPrimary?: boolean;
  addressLink: string;
  latitude: number;
  longitude: number;
  notes?: string | null;
}

export interface UserClient {
  startWeight?: number | null;
  currentWeight?: number | null;
  targetWeight?: number | null;
  height?: number | null;
  activityLevel?: 1 | 2 | 3 | 4 | 5 | null;
  goalAchievementSpeed?: 'slow' | 'recommended' | 'fast' | null;
  isWeightLifting?: boolean | null;
  roadmapId?: Types.ObjectId | null;
  addressBook?: Address[];
  allergicFoods?: string[];
  savedPlans?: Types.ObjectId[];
  mealPreferences: MealPreferences;
  currentCoach?: Record<string, unknown> | null;
}
