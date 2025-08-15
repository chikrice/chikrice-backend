import type { Macros } from './plan';

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

export interface Ingredient {
  _id?: string;
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

export interface Ingrediets {
  carb: Ingredient[];
  pro: Ingredient[];
  fat: Ingredient[];
}
