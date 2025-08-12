const {
  calculateBMR,
  calculateActivityMultiplier,
  getMilestonePeriod,
  calculateIncrement,
  calculateMacrosAdjustment,
  getMacrosRatio,
  calculateMilestoneCalories,
} = require('../../../../../src/services/roadmap/milestone/helpers');

describe('Roadmap milestones helpers unit test', () => {
  describe('calculateBMR', () => {
    it('should calculate BMR correctly for male', () => {
      const bmr = calculateBMR(80, 27, 'male', 180);
      expect(bmr).toBe(1795);
    });

    it('should calculate BMR correctly for female', () => {
      const bmr = calculateBMR(68, 25, 'female', 168);
      expect(bmr).toBe(1444);
    });
  });

  describe('calculateActivityMultiplier', () => {
    it('should calculate activity multiplier correctly for sedentary', () => {
      const activityMultiplier = calculateActivityMultiplier(1);
      expect(activityMultiplier).toBe(1.2);
    });

    it('should calculate activity multiplier correctly for lightly active', () => {
      const activityMultiplier = calculateActivityMultiplier(2);
      expect(activityMultiplier).toBe(1.375);
    });
  });

  describe('calculateIncrement', () => {
    it('should calculate increment correctly for 3 months', () => {
      const increment = calculateIncrement(3);
      expect(increment).toBe(2);
    });

    it('should calculate increment correctly for 7 months', () => {
      const increment = calculateIncrement(7);
      expect(increment).toBeCloseTo(1.5, 0);
    });
  });

  describe('calculateMacrosAdjustment', () => {
    it('should calculate macros adjustment correctly for weight loss', () => {
      const macrosAdjustment = calculateMacrosAdjustment(25, 2, 1.5, true);
      expect(macrosAdjustment).toBe(26.5);
    });

    it('should calculate macros adjustment correctly for weight gain', () => {
      const macrosAdjustment = calculateMacrosAdjustment(25, 2, 1.5, false);
      expect(macrosAdjustment).toBe(23.5);
    });
  });

  describe('getMacrosRatio', () => {
    const start = { carb: 50, pro: 35, fat: 25 };
    const end = { carb: 55, pro: 30, fat: 20 };
    const config = { month: 2, totalMonths: 3 };
    it('should get macros ratio correctly for weight loss', () => {
      config.isGainWeight = false;
      const macrosRatio = getMacrosRatio(start, end, config);

      expect(macrosRatio).toEqual({ carb: 48, pro: 37, fat: 25 });
    });

    it('should get macros ratio correctly for weight gain', () => {
      config.isGainWeight = true;
      const macrosRatio = getMacrosRatio(start, end, config);
      expect(macrosRatio).toEqual({ carb: 52, pro: 33, fat: 25 });
    });
  });

  describe('getMilestonePeriod', () => {
    it('should get milestone period correctly for first milestone', () => {
      const period = getMilestonePeriod(new Date('2024-01-01'), 0);
      expect(period).toEqual({ startDate: new Date('2024-01-01'), endDate: new Date('2024-02-01') });
    });

    it('should get milestone period correctly for third milestone', () => {
      const period = getMilestonePeriod(new Date('2024-01-01'), 2);
      expect(period).toEqual({ startDate: new Date('2024-03-01'), endDate: new Date('2024-04-01') });
    });
  });

  describe('calculateMilestoneCalories', () => {
    it('should calculate milestone calories correctly', () => {
      const input = { age: 27, gender: 'male', height: 180, activityLevel: 1 };
      const calories = calculateMilestoneCalories(input, 80, 400);

      expect(calories).toEqual({ baseCalories: 2154, targetCalories: 2554 });
    });

    it('should calculate milestone calories correctly for female', () => {
      const input = { age: 25, gender: 'female', height: 168, activityLevel: 3 };
      const calories = calculateMilestoneCalories(input, 68, -400);

      expect(calories).toEqual({ baseCalories: 2238, targetCalories: 1838 });
    });
  });
});
