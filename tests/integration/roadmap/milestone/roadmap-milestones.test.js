const { createRoadmapMilestone, createRoadmapMilestones } = require('../../../../src/services/roadmap/milestone');

describe('Roadmap Milestones Integration Tests', () => {
  const input = {
    age: 27,
    gender: 'male',
    height: 180,
    activityLevel: 1,
    isWeightLifting: true,
  };
  const overview = {
    startWeight: 77,
    targetWeight: 72,
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-03-01'),
    totalMonths: 3,
    goalAchievementSpeed: 'recommended',
    monthlyCalorieAdjustment: [-400, -500, -600],
    weightProgression: [
      {
        month: 1,
        startWeight: 77,
        targetWeight: 75,
        weightChange: 2,
        changePoint: null,
      },
      {
        month: 2,
        startWeight: 75,
        targetWeight: 73.3,
        weightChange: 1.7,
        changePoint: null,
      },
      {
        month: 3,
        startWeight: 73.3,
        targetWeight: 72,
        weightChange: 1.3,
        changePoint: null,
      },
    ],
  };

  const expectedMilestones = [
    {
      planId: null,
      month: 1,
      startWeight: 77,
      targetWeight: 75,
      startDate: new Date('2024-01-01T00:00:00.000Z'),
      endDate: new Date('2024-02-01T00:00:00.000Z'),
      baseCalories: 2118,
      targetCalories: 1718,
      macrosRatio: { carb: 45, pro: 35, fat: 20 },
      calorieAdjustment: { type: 'deficit', day: 400, month: 12000 },
      changePoint: null,
    },
    {
      planId: null,
      month: 2,
      startWeight: 75,
      targetWeight: 73.3,
      startDate: new Date('2024-02-01T00:00:00.000Z'),
      endDate: new Date('2024-03-01T00:00:00.000Z'),
      baseCalories: 2094,
      targetCalories: 1594,
      macrosRatio: { carb: 43, pro: 37, fat: 20 },
      calorieAdjustment: { type: 'deficit', day: 500, month: 15000 },
      changePoint: null,
    },
    {
      planId: null,
      month: 3,
      startWeight: 73.3,
      targetWeight: 72,
      startDate: new Date('2024-03-01T00:00:00.000Z'),
      endDate: new Date('2024-04-01T00:00:00.000Z'),
      baseCalories: 2074,
      targetCalories: 1474,
      macrosRatio: { carb: 41, pro: 39, fat: 20 },
      calorieAdjustment: { type: 'deficit', day: 600, month: 18000 },
      changePoint: null,
    },
  ];
  describe('Create Roadmap Milestone', () => {
    it('should create a valid roadmap milestones for first milestone', () => {
      const milestones = createRoadmapMilestone(input, overview, 0);

      expect(milestones).toEqual(expectedMilestones[0]);
    });
    it('should create a valid roadmap milestones for second milestone', () => {
      const milestones = createRoadmapMilestone(input, overview, 1);

      expect(milestones).toEqual(expectedMilestones[1]);
    });
    it('should create a valid roadmap milestones for third milestone', () => {
      const milestones = createRoadmapMilestone(input, overview, 2);

      expect(milestones).toEqual(expectedMilestones[2]);
    });
  });

  describe('Create Roadmap Milestones', () => {
    it('should create a valid roadmap milestones', () => {
      const milestones = createRoadmapMilestones(input, overview);
      expect(milestones).toEqual(expectedMilestones);
    });
  });
});
