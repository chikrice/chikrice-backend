import { Ingrediets } from './ingredient';

export interface Macros {
  pro: number;
  carb: number;
  fat: number;
}

export interface TargetMacros extends Macros {
  cal: number;
}

export interface Meal {
  number: number;
  recommendedMacros: Macros;
  mode: 'view' | 'edit';
  ingredients: Ingrediets;
  macros: Macros;
}

export interface MealsCount {
  meals: number;
  snacks: number;
}

export interface PlanType {
  number: number;
  mealsCount: number;
  snacksCount: number;
  name: string;
  date: Date;
  targetMacros: Macros;
  consumedMacros: Macros;
  meals: Meal[];
}
