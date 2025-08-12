const { getBestServingSize } = require('../../../../src/services/meal/free/utils/calc-serving-size-limit');

describe('SERVICES', () => {
  describe('Meal - getBestServingSize', () => {
    test('should round down to the nearest multiple of the breakpoint 0.25', () => {
      const result = getBestServingSize(7.6, 0.25);
      expect(result).toEqual(7.5);
    });

    test('should round up to the nearest multiple of the breakpoint 0.25', () => {
      const result = getBestServingSize(3.9, 0.25);
      expect(result).toEqual(4);
    });

    test('should round down to the nearest multiple of the breakpoint 0.5', () => {
      const result = getBestServingSize(7.6, 0.5);
      expect(result).toEqual(7.5);
    });

    test('should round up to the nearest multiple of the breakpoint 0.5', () => {
      const result = getBestServingSize(3.75, 0.5);
      expect(result).toEqual(4);
    });

    test('should round down to the nearest multiple of the breakpoint 1', () => {
      const result = getBestServingSize(4.4, 1);
      expect(result).toEqual(4);
    });

    test('should round up to the nearest multiple of the breakpoint 1', () => {
      const result = getBestServingSize(1.9, 1);
      expect(result).toEqual(2);
    });

    test('should return the value itself when it is an exact multiple of the breakpoint', () => {
      const result = getBestServingSize(14, 0.5);
      expect(result).toEqual(14);
    });

    test('should return smallest possible value when value is zero', () => {
      const breakpoint = 0.25;
      const result = getBestServingSize(0, breakpoint);
      expect(result).toEqual(breakpoint);
    });
  });
});
