import type { Types } from 'mongoose';

// -------------------------------------

export interface Macros {
  pro: number;
  carb: number;
  fat: number;
  cal: number;
}

export interface MealIngredient {
  _id?: Types.ObjectId;
  id?: Types.ObjectId;
  ingredientId: Types.ObjectId;
  name: {
    en: string;
    ar: string;
    fa: string;
  };
  icon?: string;
  macroType: 'carb' | 'pro' | 'fat' | 'free';
  serving: {
    weightInGrams: number;
    breakpoint: number;
    singleLabel: {
      en: string;
      ar: string;
      fa: string;
    };
    multipleLabel: {
      en: string;
      ar: string;
      fa: string;
    };
    nutrientFacts: {
      cal: number;
      carb: number;
      pro: number;
      fat: number;
    };
  };
  isAiGenerated?: boolean;
  portion: {
    qty: number;
    label: {
      en: string;
      ar: string;
      fa: string;
    };
    weightInGrams: number;
  };
  macros: {
    cal: number;
    carb: number;
    pro: number;
    fat: number;
  };
}

export interface MealIngredients {
  carb: MealIngredient[];
  pro: MealIngredient[];
  fat: MealIngredient[];
  free: MealIngredient[];
}

export interface Meal {
  _id?: Types.ObjectId;
  id?: Types.ObjectId;
  number: number;
  recommendedMacros: Macros;
  mode?: 'view' | 'edit';
  type?: 'meal' | 'snack';
  ingredients?: MealIngredients;
  macros?: Macros;
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
