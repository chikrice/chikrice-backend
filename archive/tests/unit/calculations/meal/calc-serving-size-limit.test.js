const { calcServingSizeLimit } = require('../../../../src/services/meal/free/calc-serving-size-limit');
const { getBestServingSize } = require('../../../../src/services/meal/free/calc-serving-size-limit');

describe('SERVICES', () => {
  describe('Meal - calcServingSizeLimit', () => {
    // Test with typical macro limits and breakpoints
    test('should calculate smallest and largest portions correctly with typical values', () => {
      const macroLimits = { min: 10, max: 50 };
      const macroPerServing = 15;
      const breakpoint = 0.5;

      const result = calcServingSizeLimit(macroLimits, macroPerServing, breakpoint);

      expect(result.smallestPortion).toEqual(getBestServingSize(10 / 15, 0.5));
      expect(result.largestPortion).toEqual(getBestServingSize(50 / 15, 0.5));
    });

    // Test with zero macro limits
    test('should handle zero macro limits correctly', () => {
      const macroLimits = { min: 0, max: 0 };
      const macroPerServing = 1;
      const breakpoint = 1;

      const result = calcServingSizeLimit(macroLimits, macroPerServing, breakpoint);

      expect(result.smallestPortion).toEqual(0);
      expect(result.largestPortion).toEqual(0);
    });

    // Test with equal min and max limits
    test('should handle equal min and max limits correctly', () => {
      const macroLimits = { min: 20, max: 20 };
      const macroPerServing = 4;
      const breakpoint = 1;

      const result = calcServingSizeLimit(macroLimits, macroPerServing, breakpoint);

      expect(result.smallestPortion).toEqual(getBestServingSize(20 / 4, 1)); // Expecting nearest multiple of 1
      expect(result.largestPortion).toEqual(getBestServingSize(20 / 4, 1)); // Expecting nearest multiple of 1
    });

    // Test with breakpoint smaller than macroPerServing and larger than macros limit
    test('should handle breakpoint smaller than macroPerServing correctly', () => {
      const macroLimits = { min: 10, max: 30 };
      const macroPerServing = 65;
      const breakpoint = 0.25;

      const result = calcServingSizeLimit(macroLimits, macroPerServing, breakpoint);

      expect(result.smallestPortion).toEqual(getBestServingSize(10 / 65, 0.25)); // Expecting nearest multiple of 0.25
      expect(result.largestPortion).toEqual(getBestServingSize(30 / 65, 0.25)); // Expecting nearest multiple of 0.25
    });

    // Test with maximum limits and breakpoints
    test('should handle maximum portion sizes correctly', () => {
      const macroLimits = { min: 5, max: 100 };
      const macroPerServing = 30;
      const breakpoint = 1;

      const result = calcServingSizeLimit(macroLimits, macroPerServing, breakpoint);

      expect(result.smallestPortion).toEqual(getBestServingSize(5 / 30, 1)); // Expecting nearest multiple of 1
      expect(result.largestPortion).toEqual(getBestServingSize(100 / 30, 1)); // Expecting nearest multiple of 1
    });
  });
});
