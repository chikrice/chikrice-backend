const cron = require('node-cron');
const { differenceInDays, formatISO } = require('date-fns');

const { Roadmap } = require('../models');
const config = require('../config/config');

import type { Overview, RoadmapType } from 'chikrice-types';

//------------------------------------

const calcRoadmapOverview = (overview: Overview) => {
  const dayPassed = differenceInDays(new Date(), overview.startDate);
  const newOnGoingDay = dayPassed + 1;
  const newOnGoingMonth = Math.floor(dayPassed / 30) + 1;

  return {
    newOnGoingDay,
    newOnGoingMonth,
  };
};

const updateRoadmapProgress = async () => {
  const roadmaps = await Roadmap.find({});

  const now = new Date();
  const today = formatISO(now).split('T')[0];

  const bulkOps = roadmaps.map((roadmap: RoadmapType) => {
    const { newOnGoingDay, newOnGoingMonth } = calcRoadmapOverview(roadmap.overview);

    return {
      updateOne: {
        filter: { _id: roadmap._id },
        update: {
          $set: {
            onGoingDay: newOnGoingDay,
            onGoingMonth: newOnGoingMonth,
          },
          $push: {
            activityLog: {
              date: today,
              consumedCalories: 0,
              targetCalories: roadmap.milestones[newOnGoingMonth - 1].targetCalories,
              completionPercentage: 0,
            },
          },
        },
      },
    };
  });

  if (bulkOps.length > 0) {
    await Roadmap.bulkWrite(bulkOps);
  }
};

if (config.env === 'production') {
  cron.schedule(
    '0 0 * * *',
    async () => {
      await updateRoadmapProgress();
    },
    {
      timezone: 'Asia/Dubai',
    },
  );
}
module.exports = updateRoadmapProgress;
