const calcCalories = require('../../../../src/services/roadmap/utils/calc-calories');

describe('SERVICES', () => {
  describe('Roadmap - calculate calories', () => {
    test.each([
      {
        desc: 'BMR 1500, activity 1.2, no adjustment',
        BMR: 1500,
        activityMultiplier: 1.2,
        totalCalorieAdjustment: 0,
        expected: { baseCalories: 1800, targetCalories: 1800 },
      },
      {
        desc: 'BMR 1400, activity 1.3, -600 adjustment',
        BMR: 1400,
        activityMultiplier: 1.3,
        totalCalorieAdjustment: -600,
        expected: { baseCalories: 1820, targetCalories: 1220 },
      },
      {
        desc: 'BMR 1800, activity 1.2, no adjustment',
        BMR: 1800,
        activityMultiplier: 1.2,
        totalCalorieAdjustment: 200,
        expected: { baseCalories: 2160, targetCalories: 2360 },
      },
      {
        desc: 'BMR 1800, activity 1.2, no adjustment',
        BMR: 1800,
        activityMultiplier: 1.2,
        totalCalorieAdjustment: -400,
        expected: { baseCalories: 2160, targetCalories: 1760 },
      },
    ])('returns correct calories for $desc', ({ BMR, activityMultiplier, totalCalorieAdjustment, expected }) => {
      expect(calcCalories(BMR, activityMultiplier, totalCalorieAdjustment)).toEqual(expected);
    });
  });
});
