const {
  getMealRecommendedMacros,
  getMealById,
  getIngredientArray,
  findIngredientIndex,
  calcDefaultPortionQty,
  buildPortionedIngredient,
  calcMealMacros,
} = require('../../../../src/services/plan/plan-meal-helpers');

describe('Plan meal helpers functions unit tests', () => {
  describe('getMealRecommendedMacros', () => {
    it('Should calculate recommended macros correctly for balanced meal distribution', () => {
      const plan = {
        mealsCount: 3,
        snacksCount: 2,
        targetMacros: {
          cal: 2000,
          carb: 250,
          pro: 150,
          fat: 67,
        },
      };

      const result = getMealRecommendedMacros(plan);

      // Total meals = 3 + 2 = 5
      // Each meal should get: 2000/5 = 400 cal, 250/5 = 50 carb, etc.
      expect(result).toEqual({
        cal: 400,
        carb: 50,
        pro: 30,
        fat: 13,
      });
    });

    it('Should handle single meal plan', () => {
      const plan = {
        mealsCount: 1,
        snacksCount: 0,
        targetMacros: {
          cal: 1500,
          carb: 188,
          pro: 94,
          fat: 42,
        },
      };

      const result = getMealRecommendedMacros(plan);

      expect(result).toEqual({
        cal: 1500,
        carb: 188,
        pro: 94,
        fat: 42,
      });
    });

    it('Should round macro values correctly', () => {
      const plan = {
        mealsCount: 2,
        snacksCount: 1,
        targetMacros: {
          cal: 1000,
          carb: 125,
          pro: 75,
          fat: 33,
        },
      };

      const result = getMealRecommendedMacros(plan);

      // 1000/3 = 333.33... should round to 333
      // 125/3 = 41.66... should round to 42
      expect(result).toEqual({
        cal: 333,
        carb: 42,
        pro: 25,
        fat: 11,
      });
    });

    it('Should handle zero meals count', () => {
      const plan = {
        mealsCount: 0,
        snacksCount: 0,
        targetMacros: {
          cal: 2000,
          carb: 250,
          pro: 150,
          fat: 67,
        },
      };

      const result = getMealRecommendedMacros(plan);

      // Division by zero should result in NaN, but Math.round(NaN) = 0
      expect(result).toEqual({
        cal: 0,
        carb: 0,
        pro: 0,
        fat: 0,
      });
    });
  });

  describe('getMealById', () => {
    it('Should return meal and index when meal exists', () => {
      const mealId = 'meal123';
      const plan = {
        meals: [
          { _id: 'meal123', number: 1, type: 'meal' },
          { _id: 'meal456', number: 2, type: 'snack' },
        ],
      };

      const result = getMealById(plan, mealId);

      expect(result).toEqual({
        meal: { _id: 'meal123', number: 1, type: 'meal' },
        index: 0,
      });
    });

    it('Should return null meal and -1 index when meal not found', () => {
      const mealId = 'nonexistent';
      const plan = {
        meals: [
          { _id: 'meal123', number: 1, type: 'meal' },
          { _id: 'meal456', number: 2, type: 'snack' },
        ],
      };

      const result = getMealById(plan, mealId);

      expect(result).toEqual({
        meal: null,
        index: -1,
      });
    });
  });

  describe('getIngredientArray', () => {
    it('Should return carb ingredients array', () => {
      const meal = {
        ingredients: {
          carb: [{ id: 'ing1', name: 'Rice' }],
          pro: [{ id: 'ing2', name: 'Chicken' }],
          fat: [{ id: 'ing3', name: 'Olive Oil' }],
          free: [{ id: 'ing4', name: 'Broccoli' }],
        },
      };

      const result = getIngredientArray(meal, 'carb');

      expect(result).toEqual([{ id: 'ing1', name: 'Rice' }]);
    });

    it('Should return empty array for macro type with no ingredients', () => {
      const meal = {
        ingredients: {
          carb: [],
          pro: [{ id: 'ing2', name: 'Chicken' }],
          fat: [],
          free: [],
        },
      };

      const result = getIngredientArray(meal, 'fat');

      expect(result).toEqual([]);
    });
  });

  describe('findIngredientIndex', () => {
    it('Should find ingredient by id', () => {
      const arr = [
        { id: 'ing1', name: 'Rice' },
        { id: 'ing2', name: 'Chicken' },
        { id: 'ing3', name: 'Olive Oil' },
      ];

      const result = findIngredientIndex(arr, 'ing2');

      expect(result).toBe(1);
    });

    it('Should find ingredient by _id', () => {
      const arr = [
        { _id: 'ing1', name: 'Rice' },
        { _id: { toString: () => 'ing2' }, name: 'Chicken' },
        { _id: 'ing3', name: 'Olive Oil' },
      ];

      const result = findIngredientIndex(arr, 'ing2');

      expect(result).toBe(1);
    });

    it('Should return -1 when ingredient not found', () => {
      const arr = [
        { id: 'ing1', name: 'Rice' },
        { id: 'ing2', name: 'Chicken' },
      ];

      const result = findIngredientIndex(arr, 'nonexistent');

      expect(result).toBe(-1);
    });

    it('Should return -1 for empty array', () => {
      const result = findIngredientIndex([], 'ing1');

      expect(result).toBe(-1);
    });
  });

  describe('calcDefaultPortionQty', () => {
    it('Should return 1 for free ingredients', () => {
      const ingredient = {
        macroType: 'free',
        serving: {
          nutrientFacts: { cal: 50, carb: 10, pro: 2, fat: 1 },
          breakpoint: 1,
        },
      };

      const recommendedMacros = { cal: 400, carb: 50, pro: 30, fat: 13 };

      const result = calcDefaultPortionQty(ingredient, recommendedMacros);

      expect(result).toBe(1);
    });

    it('Should calculate portion based on target macros', () => {
      const ingredient = {
        macroType: 'carb',
        serving: {
          nutrientFacts: { cal: 100, carb: 25, pro: 2, fat: 0 },
          breakpoint: 0.5,
        },
      };

      const recommendedMacros = { cal: 400, carb: 50, pro: 30, fat: 13 };

      const result = calcDefaultPortionQty(ingredient, recommendedMacros);

      // Target: 50g carb, per serving: 25g carb
      // Raw qty: 50/25 = 2
      // With breakpoint 0.5: Math.round(2/0.5) * 0.5 = 2
      expect(result).toBe(2);
    });

    it('Should handle missing serving data', () => {
      const ingredient = {
        macroType: 'pro',
        serving: null,
      };

      const recommendedMacros = { cal: 400, carb: 50, pro: 30, fat: 13 };

      const result = calcDefaultPortionQty(ingredient, recommendedMacros);

      expect(result).toBe(1);
    });

    it('Should handle missing nutrient facts', () => {
      const ingredient = {
        macroType: 'fat',
        serving: {
          nutrientFacts: null,
          breakpoint: 1,
        },
      };

      const recommendedMacros = { cal: 400, carb: 50, pro: 30, fat: 13 };

      const result = calcDefaultPortionQty(ingredient, recommendedMacros);

      expect(result).toBe(1);
    });

    it('Should snap to breakpoint multiples', () => {
      const ingredient = {
        macroType: 'pro',
        serving: {
          nutrientFacts: { cal: 120, carb: 5, pro: 20, fat: 3 },
          breakpoint: 0.25,
        },
      };

      const recommendedMacros = { cal: 400, carb: 50, pro: 30, fat: 13 };

      const result = calcDefaultPortionQty(ingredient, recommendedMacros);

      // Target: 30g pro, per serving: 20g pro
      // Raw qty: 30/20 = 1.5
      // With breakpoint 0.25: Math.round(1.5/0.25) * 0.25 = 1.5
      expect(result).toBe(1.5);
    });

    it('Should return minimum 0.5 portion', () => {
      const ingredient = {
        macroType: 'carb',
        serving: {
          nutrientFacts: { cal: 200, carb: 50, pro: 5, fat: 2 },
          breakpoint: 0.5,
        },
      };

      const recommendedMacros = { cal: 400, carb: 10, pro: 30, fat: 13 };

      const result = calcDefaultPortionQty(ingredient, recommendedMacros);

      // Target: 10g carb, per serving: 50g carb
      // Raw qty: 10/50 = 0.2
      // Should snap to minimum 0.5
      expect(result).toBe(0.5);
    });
  });

  describe('buildPortionedIngredient', () => {
    it('Should build portioned ingredient with correct macros', () => {
      const ingredient = {
        _id: 'ing1',
        name: { en: 'Rice', ar: 'أرز', fa: 'برنج' },
        macroType: 'carb',
        serving: {
          weightInGrams: 100,
          singleLabel: { en: 'cup', ar: 'كوب', fa: 'فنجان' },
          multipleLabel: { en: 'cups', ar: 'أكواب', fa: 'فنجانات' },
          nutrientFacts: { cal: 130, carb: 28, pro: 2.7, fat: 0.3 },
        },
      };

      const qty = 2;

      const result = buildPortionedIngredient(ingredient, qty);

      expect(result).toEqual({
        ...ingredient,
        isAiGenerated: false,
        portion: {
          qty: 2,
          label: { en: 'cups', ar: 'أكواب', fa: 'فنجانات' }, // multiple label since qty >= 2
          weightInGrams: 200, // 100 * 2
        },
        macros: {
          cal: 260, // 130 * 2
          carb: 56, // 28 * 2
          pro: 5.4, // 2.7 * 2
          fat: 0.6, // 0.3 * 2
        },
      });
    });

    it('Should use single label for qty < 2', () => {
      const ingredient = {
        _id: 'ing1',
        name: { en: 'Rice', ar: 'أرز', fa: 'برنج' },
        macroType: 'carb',
        serving: {
          weightInGrams: 100,
          singleLabel: { en: 'cup', ar: 'كوب', fa: 'فنجان' },
          multipleLabel: { en: 'cups', ar: 'أكواب', fa: 'فنجانات' },
          nutrientFacts: { cal: 130, carb: 28, pro: 2.7, fat: 0.3 },
        },
      };

      const qty = 1;

      const result = buildPortionedIngredient(ingredient, qty);

      expect(result.portion.label).toEqual({ en: 'cup', ar: 'كوب', fa: 'فنجان' });
    });

    it('Should handle missing serving data gracefully', () => {
      const ingredient = {
        _id: 'ing1',
        name: { en: 'Rice', ar: 'أرز', fa: 'برنج' },
        macroType: 'carb',
        serving: null,
      };

      const qty = 1;

      const result = buildPortionedIngredient(ingredient, qty);

      expect(result).toEqual({
        ...ingredient,
        isAiGenerated: false,
        portion: {
          qty: 1,
          label: undefined,
          weightInGrams: 0,
        },
        macros: {
          cal: 0,
          carb: 0,
          pro: 0,
          fat: 0,
        },
      });
    });

    it('Should handle missing nutrient facts', () => {
      const ingredient = {
        _id: 'ing1',
        name: { en: 'Rice', ar: 'أرز', fa: 'برنج' },
        macroType: 'carb',
        serving: {
          weightInGrams: 100,
          singleLabel: { en: 'cup', ar: 'كوب', fa: 'فنجان' },
          multipleLabel: { en: 'cups', ar: 'أكواب', fa: 'فنجانات' },
          nutrientFacts: null,
        },
      };

      const qty = 2;

      const result = buildPortionedIngredient(ingredient, qty);

      expect(result.macros).toEqual({
        cal: 0,
        carb: 0,
        pro: 0,
        fat: 0,
      });
    });
  });

  describe('calcMealMacros', () => {
    it('Should calculate total macros from all ingredient types', () => {
      const meal = {
        ingredients: {
          carb: [
            { macros: { cal: 130, carb: 28, pro: 2.7, fat: 0.3 } },
            { macros: { cal: 100, carb: 22, pro: 1.5, fat: 0.1 } },
          ],
          pro: [{ macros: { cal: 165, carb: 0, pro: 31, fat: 3.6 } }],
          fat: [{ macros: { cal: 45, carb: 0, pro: 0, fat: 5 } }],
          free: [{ macros: { cal: 25, carb: 5, pro: 1, fat: 0 } }],
        },
      };

      const result = calcMealMacros(meal);

      expect(result).toEqual({
        cal: 465, // 130+100+165+45+25
        carb: 55, // 28+22+0+0+5
        pro: 36.2, // 2.7+1.5+31+0+1
        fat: 9, // 0.3+0.1+3.6+5+0
      });
    });

    it('Should handle empty ingredient arrays', () => {
      const meal = {
        ingredients: {
          carb: [],
          pro: [],
          fat: [],
          free: [],
        },
      };

      const result = calcMealMacros(meal);

      expect(result).toEqual({
        cal: 0,
        carb: 0,
        pro: 0,
        fat: 0,
      });
    });

    it('Should handle ingredients with missing macros', () => {
      const meal = {
        ingredients: {
          carb: [
            { macros: { cal: 130, carb: 28, pro: 2.7, fat: 0.3 } },
            { macros: null },
            { macros: { cal: 100, carb: 22, pro: 1.5, fat: 0.1 } },
          ],
          pro: [{ macros: { cal: 165, carb: 0, pro: 31, fat: 3.6 } }],
          fat: [],
          free: [],
        },
      };

      const result = calcMealMacros(meal);

      expect(result).toEqual({
        cal: 395, // 130+0+100+165
        carb: 50, // 28+0+22+0
        pro: 35.2, // 2.7+0+1.5+31
        fat: 4, // 0.3+0+0.1+3.6
      });
    });

    it('Should handle ingredients with partial macro data', () => {
      const meal = {
        ingredients: {
          carb: [
            { macros: { cal: 130, carb: 28, pro: 2.7, fat: 0.3 } },
            { macros: { cal: 100, carb: 22 } }, // missing pro and fat
          ],
          pro: [
            { macros: { cal: 165, pro: 31 } }, // missing carb and fat
          ],
          fat: [],
          free: [],
        },
      };

      const result = calcMealMacros(meal);

      expect(result).toEqual({
        cal: 395, // 130+100+165
        carb: 50, // 28+22+0
        pro: 33.7, // 2.7+0+31
        fat: 0.3, // 0.3+0+0
      });
    });
  });
});
