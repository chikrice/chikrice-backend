const calcNutrientComboOptions = require('../../../../src/services/meal/free/calc-nutrient-combo-options');
const { carbIngredients, carbLimit } = require('./data');

describe('SERVICES', () => {
  describe('Meal calcNutrientComboOptions', () => {
    test('should return array of specefic nutrient(carb, pro, fat) for all possible combo options', () => {
      const result = calcNutrientComboOptions(carbIngredients, carbLimit, 'carb');

      expect(result).toEqual([
        {
          macros: { cal: 149.75, carb: 19.5, pro: 4.825, fat: 4.375 },
          ingredients: [
            {
              icon: '🌾',
              type: 'carb',
              weightInGrams: 20,
              serving: { qty: 0.25, label: { en: 'cup', ar: 'كوب' } },
              isCountable: false,
              macros: { cal: 76.75, carb: 13.5, pro: 0.825, fat: 0.375 },
            },
            {
              icon: '🥛',
              type: 'carb',
              weightInGrams: 122,
              serving: { qty: 0.5, label: { en: 'cup', ar: 'كوب' } },
              isCountable: true,
              macros: { cal: 73, carb: 6, pro: 4, fat: 4 },
            },
          ],
        },
        {
          macros: { cal: 299.5, carb: 39, pro: 9.65, fat: 8.75 },
          ingredients: [
            {
              icon: '🌾',
              type: 'carb',
              weightInGrams: 40,
              serving: { qty: 0.5, label: { en: 'cup', ar: 'كوب' } },
              isCountable: false,
              macros: { cal: 153.5, carb: 27, pro: 1.65, fat: 0.75 },
            },
            {
              icon: '🥛',
              type: 'carb',
              weightInGrams: 244,
              serving: { qty: 1, label: { en: 'cup', ar: 'كوب' } },
              isCountable: true,
              macros: { cal: 146, carb: 12, pro: 8, fat: 8 },
            },
          ],
        },
        {
          macros: { cal: 449.25, carb: 58.5, pro: 14.475, fat: 13.125 },
          ingredients: [
            {
              icon: '🌾',
              type: 'carb',
              weightInGrams: 60,
              serving: { qty: 0.75, label: { en: 'cup', ar: 'كوب' } },
              isCountable: false,
              macros: { cal: 230.25, carb: 40.5, pro: 2.4749999999999996, fat: 1.125 },
            },
            {
              icon: '🥛',
              type: 'carb',
              weightInGrams: 366,
              serving: { qty: 1.5, label: { en: 'cups', ar: 'أكواب' } },
              isCountable: true,
              macros: { cal: 219, carb: 18, pro: 12, fat: 12 },
            },
          ],
        },
      ]);
    });
  });
});
