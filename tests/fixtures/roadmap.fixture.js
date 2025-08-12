const { Types } = require('mongoose');

const { Roadmap } = require('../../src/models');

const roadmapOne = {
  overview: {
    currentWeight: 77,
    monthlyCalorieAdjustment: [-400, -500, -600],
    startWeight: 77,
    targetWeight: 72,
    totalDays: 90,
    totalMonths: 3,
    weightProgression: [
      {
        changePoint: null,
        month: 0,
        startWeight: 77,
        targetWeight: 77,
        weightChange: 0,
      },
      {
        changePoint: null,
        month: 1,
        startWeight: 77,
        targetWeight: 74.9,
        weightChange: -2.1,
      },
      {
        changePoint: null,
        month: 2,
        startWeight: 74.9,
        targetWeight: 73.2,
        weightChange: -1.7,
      },
      {
        changePoint: null,
        month: 3,
        startWeight: 73.2,
        targetWeight: 72,
        weightChange: -1.2,
      },
    ],
    startDate: '2025-08-04T00:00:00.000Z',
    endDate: '2025-11-02T00:00:00.000Z',
  },
  onGoingMonth: 1,
  onGoingDay: 1,
  isWeightChangeOverLimit: false,
  userId: '6890bf0f0bf2ad3d247ef0bc',
  milestones: [
    {
      calorieAdjustment: {
        day: 400,
        month: 12000,
        type: 'deficit',
      },
      planId: null,
      changePoint: null,
      month: 1,
      startWeight: 77,
      targetWeight: 77,
      startDate: '2025-08-04T00:00:00.000Z',
      endDate: '2025-09-04T00:00:00.000Z',
      baseCalories: 2745,
      targetCalories: 2345,
      macrosRatio: {
        carb: 50,
        pro: 30,
        fat: 20,
      },
      _id: Types.ObjectId(),
    },
    {
      calorieAdjustment: {
        day: 500,
        month: 15000,
        type: 'deficit',
      },
      planId: null,
      changePoint: null,
      month: 2,
      startWeight: 77,
      targetWeight: 74.9,
      startDate: '2025-09-04T00:00:00.000Z',
      endDate: '2025-10-04T00:00:00.000Z',
      baseCalories: 2745,
      targetCalories: 2245,
      macrosRatio: {
        carb: 48,
        pro: 32,
        fat: 20,
      },
      _id: Types.ObjectId(),
    },
    {
      calorieAdjustment: {
        day: 600,
        month: 18000,
        type: 'deficit',
      },
      planId: null,
      changePoint: null,
      month: 3,
      startWeight: 74.9,
      targetWeight: 73.2,
      startDate: '2025-10-04T00:00:00.000Z',
      endDate: '2025-11-04T00:00:00.000Z',
      baseCalories: 2713,
      targetCalories: 2113,
      macrosRatio: {
        carb: 46,
        pro: 34,
        fat: 20,
      },
      _id: Types.ObjectId(),
    },
  ],
  activityLog: [
    {
      active: false,
      date: '2025-08-04T00:00:00.000Z',
    },
  ],
  _id: Types.ObjectId(),
};

const insertRoadmaps = async (roadmaps) => {
  await Roadmap.insertMany(roadmaps.map((roadmap) => ({ ...roadmap })));
};

module.exports = {
  roadmapOne,
  insertRoadmaps,
};
