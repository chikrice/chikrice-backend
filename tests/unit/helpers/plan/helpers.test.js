const {
  generateDateRange,
  calculateTargetMacros,
  calculateMealsCount,
} = require('../../../../src/services/plan/helpers');

describe('Plan helpers functions unit tests', () => {
  describe('generateDateRange', () => {
    it('Should return 31 days for a 31-day range', () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-02-01');

      const dayDiff = generateDateRange(startDate.toISOString(), endDate.toISOString());
      expect(dayDiff).toBe(31);
    });

    it('Should return 28 days for a 28-day range', () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-29');

      const dayDiff = generateDateRange(startDate.toISOString(), endDate.toISOString());
      expect(dayDiff).toBe(28);
    });

    it('Should return 0 day for same date', () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-01');

      const dayDiff = generateDateRange(startDate.toISOString(), endDate.toISOString());
      expect(dayDiff).toBe(0);
    });

    it('Should handle leap year correctly', () => {
      const startDate = new Date('2024-02-01');
      const endDate = new Date('2024-03-01');

      const dayDiff = generateDateRange(startDate.toISOString(), endDate.toISOString());
      expect(dayDiff).toBe(29); // February 2024 has 29 days (leap year)
    });

    it('Should handle partial days correctly', () => {
      const startDate = new Date('2024-01-01T00:00:00.000Z');
      const endDate = new Date('2024-01-01T23:59:59.999Z');

      const dayDiff = generateDateRange(startDate.toISOString(), endDate.toISOString());
      expect(dayDiff).toBe(1);
    });

    it('Should handle multi-month ranges', () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-03-01');

      const dayDiff = generateDateRange(startDate.toISOString(), endDate.toISOString());
      expect(dayDiff).toBe(60); // January (31) + February (29 leap year)
    });
  });

  describe('calculateTargetMacros', () => {
    it('Should calculate macros correctly for 2000 calories with 40-30-30 ratio', () => {
      const ratio = { carb: 40, pro: 30, fat: 30 };
      const calories = 2000;

      const result = calculateTargetMacros(ratio, calories);

      // Expected calculations:
      // Carb: (40/100) * 2000 = 800 calories / 4 = 200g
      // Pro: (30/100) * 2000 = 600 calories / 4 = 150g
      // Fat: (30/100) * 2000 = 600 calories / 9 = 66.67g ≈ 67g
      expect(result).toEqual({
        cal: 2000,
        carb: 200,
        pro: 150,
        fat: 67,
      });
    });

    it('Should calculate macros correctly for 1500 calories with 50-25-25 ratio', () => {
      const ratio = { carb: 50, pro: 25, fat: 25 };
      const calories = 1500;

      const result = calculateTargetMacros(ratio, calories);

      // Expected calculations:
      // Carb: (50/100) * 1500 = 750 calories / 4 = 187.5g ≈ 188g
      // Pro: (25/100) * 1500 = 375 calories / 4 = 93.75g ≈ 94g
      // Fat: (25/100) * 1500 = 375 calories / 9 = 41.67g ≈ 42g
      expect(result).toEqual({
        cal: 1500,
        carb: 188,
        pro: 94,
        fat: 42,
      });
    });

    it('Should calculate macros correctly for 3000 calories with 60-20-20 ratio', () => {
      const ratio = { carb: 60, pro: 20, fat: 20 };
      const calories = 3000;

      const result = calculateTargetMacros(ratio, calories);

      // Expected calculations:
      // Carb: (60/100) * 3000 = 1800 calories / 4 = 450g
      // Pro: (20/100) * 3000 = 600 calories / 4 = 150g
      // Fat: (20/100) * 3000 = 600 calories / 9 = 66.67g ≈ 67g
      expect(result).toEqual({
        cal: 3000,
        carb: 450,
        pro: 150,
        fat: 67,
      });
    });

    it('Should handle zero calories', () => {
      const ratio = { carb: 40, pro: 30, fat: 30 };
      const calories = 0;

      const result = calculateTargetMacros(ratio, calories);

      expect(result).toEqual({
        cal: 0,
        carb: 0,
        pro: 0,
        fat: 0,
      });
    });

    it('Should handle decimal ratios', () => {
      const ratio = { carb: 45.5, pro: 27.5, fat: 27 };
      const calories = 1800;

      const result = calculateTargetMacros(ratio, calories);

      // Expected calculations:
      // Carb: (45.5/100) * 1800 = 819 calories / 4 = 204.75g ≈ 205g
      // Pro: (27.5/100) * 1800 = 495 calories / 4 = 123.75g ≈ 124g
      // Fat: (27/100) * 1800 = 486 calories / 9 = 54g
      expect(result).toEqual({
        cal: 1800,
        carb: 205,
        pro: 124,
        fat: 54,
      });
    });
  });

  describe('calculateMealsCount', () => {
    it('Should return 3 meals and 1 snack for low calories (≤1500)', () => {
      const result1 = calculateMealsCount(1200);
      expect(result1).toEqual({ meals: 3, snacks: 1 });

      const result2 = calculateMealsCount(1500);
      expect(result2).toEqual({ meals: 3, snacks: 1 });
    });

    it('Should return 3 meals and 2 snacks for medium calories (1501-2500)', () => {
      const result1 = calculateMealsCount(1600);
      expect(result1).toEqual({ meals: 3, snacks: 2 });

      const result2 = calculateMealsCount(2000);
      expect(result2).toEqual({ meals: 3, snacks: 2 });

      const result3 = calculateMealsCount(2500);
      expect(result3).toEqual({ meals: 3, snacks: 2 });
    });

    it('Should return 4 meals and 2 snacks for high calories (2501-3000)', () => {
      const result1 = calculateMealsCount(2600);
      expect(result1).toEqual({ meals: 4, snacks: 2 });

      const result2 = calculateMealsCount(2800);
      expect(result2).toEqual({ meals: 4, snacks: 2 });

      const result3 = calculateMealsCount(3000);
      expect(result3).toEqual({ meals: 4, snacks: 2 });
    });

    it('Should return 4 meals and 3 snacks for very high calories (3001-3500)', () => {
      const result1 = calculateMealsCount(3100);
      expect(result1).toEqual({ meals: 4, snacks: 3 });

      const result2 = calculateMealsCount(3300);
      expect(result2).toEqual({ meals: 4, snacks: 3 });

      const result3 = calculateMealsCount(3500);
      expect(result3).toEqual({ meals: 4, snacks: 3 });
    });

    it('Should return 5 meals and 3 snacks for extreme calories (>3500)', () => {
      const result1 = calculateMealsCount(3600);
      expect(result1).toEqual({ meals: 5, snacks: 3 });

      const result2 = calculateMealsCount(4000);
      expect(result2).toEqual({ meals: 5, snacks: 3 });

      const result3 = calculateMealsCount(5000);
      expect(result3).toEqual({ meals: 5, snacks: 3 });
    });

    it('Should handle edge cases at threshold boundaries', () => {
      // Test exact threshold values
      expect(calculateMealsCount(1500)).toEqual({ meals: 3, snacks: 1 });
      expect(calculateMealsCount(1501)).toEqual({ meals: 3, snacks: 2 });

      expect(calculateMealsCount(2500)).toEqual({ meals: 3, snacks: 2 });
      expect(calculateMealsCount(2501)).toEqual({ meals: 4, snacks: 2 });

      expect(calculateMealsCount(3000)).toEqual({ meals: 4, snacks: 2 });
      expect(calculateMealsCount(3001)).toEqual({ meals: 4, snacks: 3 });

      expect(calculateMealsCount(3500)).toEqual({ meals: 4, snacks: 3 });
      expect(calculateMealsCount(3501)).toEqual({ meals: 5, snacks: 3 });
    });

    it('Should handle zero and negative calories', () => {
      // For zero or negative calories, it should default to the lowest tier
      expect(calculateMealsCount(0)).toEqual({ meals: 3, snacks: 1 });
      expect(calculateMealsCount(-100)).toEqual({ meals: 3, snacks: 1 });
    });
  });
});
