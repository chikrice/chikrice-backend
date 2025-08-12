const calcNutrientPortions = require('../../../../src/services/meal/free/calc-nutrient-portions');
const { carbLimit, carbIngredients } = require('./data');

describe('SERVICES', () => {
  describe('Meal - getNutrientOptions', () => {
    test('should return correct nutrient portions between the carb limit with correct serving size and macros', () => {
      // carbLimit -> min = 20, max = 70
      const oats = carbIngredients[0];

      const result = calcNutrientPortions(oats, carbLimit, 'carb');

      const expectedResults = [
        {
          macros: { cal: 76.75, carb: 13.5, pro: 0.825, fat: 0.375 },
          ingredients: [
            {
              icon: '🌾',
              type: 'carb',
              weightInGrams: 20,
              serving: { qty: 0.25, label: { en: 'cup', ar: 'كوب' } },
              isCountable: false,
              macros: { cal: 76.75, carb: 13.5, pro: 0.825, fat: 0.375 },
            },
          ],
        },
        {
          macros: { cal: 153.5, carb: 27, pro: 1.65, fat: 0.75 },
          ingredients: [
            {
              icon: '🌾',
              type: 'carb',
              weightInGrams: 40,
              serving: { qty: 0.5, label: { en: 'cup', ar: 'كوب' } },
              isCountable: false,
              macros: { cal: 153.5, carb: 27, pro: 1.65, fat: 0.75 },
            },
          ],
        },
        {
          macros: { cal: 230.25, carb: 40.5, pro: 2.4749999999999996, fat: 1.125 },
          ingredients: [
            {
              icon: '🌾',
              type: 'carb',
              weightInGrams: 60,
              serving: { qty: 0.75, label: { en: 'cup', ar: 'كوب' } },
              isCountable: false,
              macros: { cal: 230.25, carb: 40.5, pro: 2.4749999999999996, fat: 1.125 },
            },
          ],
        },
        {
          macros: { cal: 307, carb: 54, pro: 3.3, fat: 1.5 },
          ingredients: [
            {
              icon: '🌾',
              type: 'carb',
              weightInGrams: 80,
              serving: { qty: 1, label: { en: 'cup', ar: 'كوب' } },
              isCountable: false,
              macros: { cal: 307, carb: 54, pro: 3.3, fat: 1.5 },
            },
          ],
        },
        {
          macros: { cal: 383.75, carb: 67.5, pro: 4.125, fat: 1.875 },
          ingredients: [
            {
              icon: '🌾',
              type: 'carb',
              weightInGrams: 100,
              serving: { qty: 1.25, label: { en: 'cups', ar: 'أكواب' } },
              isCountable: false,
              macros: { cal: 383.75, carb: 67.5, pro: 4.125, fat: 1.875 },
            },
          ],
        },
      ];

      expect(result).toHaveLength(expectedResults.length);
      result.forEach((item, index) => {
        expect(item).toEqual(expectedResults[index]);
      });
    });

    test('should handle case when carbIngredients has no data', () => {
      const emptyIngredients = {};
      const result = calcNutrientPortions(emptyIngredients, carbLimit, 'carb');

      expect(result).toEqual([]);
    });
  });
});
