const getBestIngredientsCombo = require('../../../../src/services/meal/free/get-best-ingredients-combo');
const { carbIngredients } = require('./data');

describe('SERVICES', () => {
  describe('Meal getBestIngredientsCombo', () => {
    // Test typical sizes
    test('should return best serving size for each ingredient to meet our available carb', () => {
      const carbLimit = 20;
      const result = getBestIngredientsCombo(carbIngredients, carbLimit, 'carb');

      expect(result).toEqual({
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
      });
    });

    test('should handle 0 carb correctly', () => {
      const carbLimit = 0;
      const result = getBestIngredientsCombo(carbIngredients, carbLimit, 'carb');

      expect(result).toEqual({
        macros: { cal: 0, carb: 0, pro: 0, fat: 0 },
        ingredients: [
          {
            icon: '🌾',
            type: 'carb',
            weightInGrams: 0,
            serving: { qty: 0, label: { en: 'cup', ar: 'كوب' } },
            isCountable: false,
            macros: { cal: 0, carb: 0, pro: 0, fat: 0 },
          },
          {
            icon: '🥛',
            type: 'carb',
            weightInGrams: 0,
            serving: { qty: 0, label: { en: 'cup', ar: 'كوب' } },
            isCountable: true,
            macros: { cal: 0, carb: 0, pro: 0, fat: 0 },
          },
        ],
      });
    });
  });
});
