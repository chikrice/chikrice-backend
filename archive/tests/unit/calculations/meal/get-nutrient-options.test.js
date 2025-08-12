const calcNutrientComboOptions = require('../../../../src/services/meal/free/calc-nutrient-combo-options');
const calcNutrientPortions = require('../../../../src/services/meal/free/calc-nutrient-portions');
const getNutrientOptions = require('../../../../src/services/meal/free/get-nutrient-options');

const { carbLimit, carbIngredients } = require('./data');

describe('SERVICES', () => {
  describe('Meal - getNutrientOptions', () => {
    // CARB
    test('should return correct nutrient options for many carb ingredints', () => {
      const result = getNutrientOptions(carbIngredients, carbLimit, 'carb');
      const expectedResults = calcNutrientComboOptions(carbIngredients, carbLimit, 'carb');
      expect(result).toEqual(expectedResults);
    });

    test('should return correct nutrient options for one carb ingredint', () => {
      const result = getNutrientOptions([carbIngredients[0]], carbLimit, 'carb');
      const expectedResults = calcNutrientPortions(carbIngredients[0], carbLimit, 'carb');
      expect(result).toEqual(expectedResults);
    });

    test('should return correct nutrient options for no carb ingredient', () => {
      const result = getNutrientOptions([], carbLimit, 'carb');

      expect(result).toEqual([]);
    });
  });
});
