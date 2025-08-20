import type { Macros } from './plan';
import type { Types } from 'mongoose';

// -------------------------------------

export interface NutrientFacts extends Macros {
  cal: number;
}

export interface LocalizedString {
  en: string;
  ar: string;
  fa: string;
}

export interface Serving {
  weightInGrams: number;
  breakpoint: number;
  singleLabel: LocalizedString;
  multipleLabel: LocalizedString;
  nutrientFacts: NutrientFacts;
}

export enum IngredientCategory {
  FATS = 'fats',
  CARBS = 'carbs',
  DAIRY = 'dairy',
  FRUITS = 'fruits',
  SNACKS = 'snacks',
  PROTEINS = 'proteins',
  CONDIMENTS = 'condiments',
  VEGETABLES = 'vegetables',
  SAUCES = 'sauces',
  BEVERAGES = 'beverages',
}

export interface IngredientType {
  _id: Types.ObjectId;
  icon?: string;
  prepType: 'none' | 'daily' | 'batch';
  name: LocalizedString;
  macroType: 'carb' | 'fat' | 'pro' | 'free';
  mealType: 'meal' | 'snack' | 'all';
  category: IngredientCategory;
  isRaw: boolean;
  serving: Serving;
  createdAt?: Date;
  updatedAt?: Date;
}
