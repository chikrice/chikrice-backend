const calcCalories = require('./calc-calories');

describe('calcCalories', () => {
  test.each([
    {
      desc: 'BMR 1500, activity 1.2, no adjustment',
      BMR: 1500,
      activityMultiplier: 1.2,
      totalCalorieAdjustment: 0,
      expected: { baseCalories: 1800, targetCalories: 1800 },
    },
    {
      desc: 'BMR 1600, activity 1.5, +200 adjustment',
      BMR: 1600,
      activityMultiplier: 1.5,
      totalCalorieAdjustment: 200,
      expected: { baseCalories: 2400, targetCalories: 2600 },
    },
    {
      desc: 'BMR 1400, activity 1.3, -300 adjustment',
      BMR: 1400,
      activityMultiplier: 1.3,
      totalCalorieAdjustment: -300,
      expected: { baseCalories: 1820, targetCalories: 1520 },
    },
    {
      desc: 'BMR 2000, activity 1.0, no adjustment',
      BMR: 2000,
      activityMultiplier: 1.0,
      totalCalorieAdjustment: 0,
      expected: { baseCalories: 2000, targetCalories: 2000 },
    },
  ])('returns correct calories for $desc', ({ BMR, activityMultiplier, totalCalorieAdjustment, expected }) => {
    expect(calcCalories(BMR, activityMultiplier, totalCalorieAdjustment)).toEqual(expected);
  });
});
