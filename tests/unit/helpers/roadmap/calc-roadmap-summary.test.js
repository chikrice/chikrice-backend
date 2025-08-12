const calcRoadmapSummary = require('../../../../src/services/roadmap/utils/cal-roadmap-summary');

describe('SERVICES: Roadmap - calculate total calorie adjustment', () => {
  test.each([
    {
      name: '0 weight change',
      weightChange: 0,
      isGainWeight: false,
      initialCalorieAdjustment: 400,
      expected: { totalMonths: 1, totalDays: 30, monthlyCalorieAdjustment: [] },
    },
    {
      name: 'weight gain of 1kg with initial 400 calorie adjustment',
      weightChange: 1,
      isGainWeight: true,
      initialCalorieAdjustment: 400,
      expected: { totalMonths: 1, totalDays: 30, monthlyCalorieAdjustment: [400] },
    },
    {
      name: 'weight loss of 2kg with initial 400 calorie adjustment',
      weightChange: 2,
      isGainWeight: false,
      initialCalorieAdjustment: 400,
      expected: { totalMonths: 1, totalDays: 30, monthlyCalorieAdjustment: [-400] },
    },
    {
      name: 'weight gain of 5kg with initial 400 calorie adjustment',
      weightChange: 5,
      isGainWeight: true,
      initialCalorieAdjustment: 400,
      expected: { totalMonths: 3, totalDays: 90, monthlyCalorieAdjustment: [400, 500, 600] },
    },
    {
      name: 'weight gain of 8kg with initial 600 calorie adjustment',
      weightChange: 8,
      isGainWeight: true,
      initialCalorieAdjustment: 600,
      expected: { totalMonths: 3, totalDays: 90, monthlyCalorieAdjustment: [600, 700, 800] },
    },
    {
      name: 'weight loss of 4kg with initial 500 calorie adjustment',
      weightChange: 4,
      isGainWeight: false,
      initialCalorieAdjustment: 500,
      expected: { totalMonths: 2, totalDays: 60, monthlyCalorieAdjustment: [-500, -600] },
    },
    {
      name: 'weight loss of 12kg with initial 700 calorie adjustment',
      weightChange: 12,
      isGainWeight: false,
      initialCalorieAdjustment: 700,
      expected: { totalMonths: 4, totalDays: 120, monthlyCalorieAdjustment: [-700, -800, -900, -1000] },
    },
    {
      name: 'weight gain of 12kg with initial 500 calorie adjustment',
      weightChange: 12,
      isGainWeight: true,
      initialCalorieAdjustment: 500,
      expected: { totalMonths: 5, totalDays: 150, monthlyCalorieAdjustment: [500, 600, 700, 800, 900] },
    },
  ])(
    'should return correct summary for $name',
    ({ weightChange, isGainWeight, initialCalorieAdjustment, expected }) => {
      const result = calcRoadmapSummary(weightChange, isGainWeight, initialCalorieAdjustment);
      expect(result).toEqual(expected);
    },
  );
});
