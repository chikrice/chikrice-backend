import { Ingrediets } from './ingredient';

export interface Macros {
  pro: number;
  carb: number;
  fat: number;
}

export interface Meal {
  number: number;
  recommendedMacros: Macros;
  mode: 'view' | 'edit';
  ingredients: Ingrediets;
  macros: Macros;
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
