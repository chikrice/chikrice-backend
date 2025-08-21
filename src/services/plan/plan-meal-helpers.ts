import httpStatus from 'http-status';

import { Roadmap } from '@/models';
import ApiError from '@/utils/ApiError';
import { PlanDoc } from '@/models/plan';

import type { IngredientType, Macros, Meal, MealIngredient, MealIngredients, PlanReference } from 'chikrice-types';

// ============================================
// GET MEAL RECOMMENDED MACROS
// ============================================
export const getMealRecommendedMacros = (plan: PlanDoc): Macros => {
  const { snacksCount, mealsCount, targetMacros } = plan;
  const { carb, pro, fat, cal } = targetMacros;

  const totalMealsCount = snacksCount + mealsCount;

  if (!totalMealsCount) return { cal: 0, carb: 0, pro: 0, fat: 0 };

  const recommendedMacros = {
    cal: Math.round(cal / totalMealsCount),
    carb: Math.round(carb / totalMealsCount),
    pro: Math.round(pro / totalMealsCount),
    fat: Math.round(fat / totalMealsCount),
  };

  return recommendedMacros;
};

// ============================================
// MEAL SUGGESTIONS
// ============================================
export const getMilestonePlansForSuggestions = async (roadmapId: string): Promise<PlanReference[]> => {
  const roadmap = await Roadmap.findById(roadmapId);
  if (!roadmap) throw new ApiError(httpStatus.NOT_FOUND, 'Roadmap not found');
  const { milestones, onGoingMonth } = roadmap;

  const milestone = milestones[onGoingMonth - 1];

  if (!milestone) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Milestone not found in roadmap');
  }

  const { plans } = milestone;

  if (!plans) throw new ApiError(httpStatus.BAD_REQUEST, 'User milestone plans are empty');

  return plans;
};

// ============================================
// MEAL UTILITIES
// ============================================
type MacroKey = keyof MealIngredients;

const MACRO_KEYS: MacroKey[] = ['carb', 'pro', 'fat', 'free'];

// ============================================
// GET MEAL BY ID FROM MEALS ARRAY
// ============================================
export const getMealById = (plan: PlanDoc, mealId: string): { meal: Meal | null; index: number } => {
  const idx = plan.meals.findIndex((m: Meal) => m._id?.toString() === mealId);
  if (idx === -1) return { meal: null, index: -1 };
  return { meal: plan.meals[idx], index: idx };
};

// ============================================
// GET THE INGREDIENT ARRAY
// ============================================
export const getIngredientArray = (meal: Meal, macroType: MacroKey): MealIngredient[] => meal.ingredients![macroType];

// ============================================
// FIND INGREDIENT INDEX WITHIN AN ARRAY
// ============================================
export const findIngredientIndex = (arr: MealIngredient[], ingredientId: string): number =>
  arr.findIndex((ing) => ing.ingredientId === ingredientId);

// ============================================
// PICK THE DEFAULT PORTION LABEL
// ============================================
const pickPortionLabel = (
  qty: number,
  singleLabel: MealIngredient['serving']['singleLabel'],
  multipleLabel: MealIngredient['serving']['multipleLabel'],
): MealIngredient['serving']['singleLabel'] => (qty >= 2 ? multipleLabel : singleLabel);

// ============================================
// CALCULATE THE RECOMMENDED DEFAULT PORTION SIZE
// ============================================
export const calcDefaultPortionQty = (ingredient: IngredientType, recommendedMacros: Macros): number => {
  const { macroType, serving, category } = ingredient;
  if (!serving || !serving.nutrientFacts) return 1;

  if (category === 'proteins' || category === 'carbs') {
    const macro = macroType as keyof Macros;
    const target = recommendedMacros[macro] ?? 0;
    const perServing = serving.nutrientFacts[macro] ?? 0;
    if (!perServing) return 1;

    const rawQty = target / perServing;
    const bp = serving.breakpoint ?? 1;
    // Snap to nearest 0.5 or to breakpoint multiples if provided
    const snapped = Math.max(0.5, Math.round(rawQty / bp) * bp);
    return +snapped.toFixed(2);
  }

  return 1;
};

// ============================================
//  PORTION CREATION
// ============================================
export const buildPortionedIngredient = (ingredient: IngredientType, qty: number): MealIngredient => {
  const { serving } = ingredient;
  const nf = serving?.nutrientFacts || { cal: 0, carb: 0, pro: 0, fat: 0 };
  const label = pickPortionLabel(qty, serving?.singleLabel, serving?.multipleLabel) || serving?.singleLabel;

  return {
    // Only include fields that belong to MealIngredient schema
    ingredientId: ingredient._id,
    name: ingredient.name,
    icon: ingredient.icon || '',
    macroType: ingredient.macroType,
    serving: {
      weightInGrams: serving?.weightInGrams || 0,
      breakpoint: serving?.breakpoint || 1,
      singleLabel: serving?.singleLabel,
      multipleLabel: serving?.multipleLabel,
      nutrientFacts: nf,
    },
    isAiGenerated: false,
    portion: {
      qty,
      label,
      weightInGrams: (serving?.weightInGrams || 0) * qty,
    },
    macros: {
      cal: (nf.cal || 0) * qty,
      carb: (nf.carb || 0) * qty,
      pro: (nf.pro || 0) * qty,
      fat: (nf.fat || 0) * qty,
    },
  };
};

// ============================================
// MEAL MACRO CALCULATIONS
// ============================================
export const calcMealMacros = (meal: Meal): Macros => {
  const total: Macros = { cal: 0, carb: 0, pro: 0, fat: 0 };

  MACRO_KEYS.forEach((key) => {
    meal.ingredients![key].forEach((ing) => {
      total.cal += ing?.macros?.cal || 0;
      total.carb += ing?.macros?.carb || 0;
      total.pro += ing?.macros?.pro || 0;
      total.fat += ing?.macros?.fat || 0;
    });
  });

  return total;
};
