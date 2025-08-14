import httpStatus from 'http-status';

import ApiError from '@/utils/ApiError';
import { PlanMonth, Roadmap, PlanDay } from '@/models';

import {
  getPlanMonthPeriod,
  generatePlanMonthWeeksData,
  validateRoadmap,
  extractCurrentMilestone,
  createPlanObject,
  updateRoadmapWithPlanId,
  extractPlanDaysData,
  updateWeeksWithPlanDayIds,
} from './helpers';

import type { PlanMonthDoc } from '@/models/plan-month';
import type { CreatePlanDTO } from '@/validations/plan-month.validation';

// ============================================
// PLAN MONTH CREATION
// ============================================
export const createPlanMonth = async (input: CreatePlanDTO): Promise<PlanMonthDoc> => {
  const { roadmapId } = input;

  const roadmap = await Roadmap.findById(roadmapId, {
    onGoingMonth: 1,
    milestones: 1,
    userId: 1,
  });

  const validatedRoadmap = validateRoadmap(roadmap);
  const { onGoingMonth, userId } = validatedRoadmap;

  const milestone = extractCurrentMilestone(validatedRoadmap);

  const period = getPlanMonthPeriod(milestone.startDate, milestone.endDate);

  const weeksData = generatePlanMonthWeeksData(period, milestone, userId);

  const planDaysData = extractPlanDaysData(weeksData);
  // what question do you have?
  // currently I am creating
  // weeks => days => day
  //
  // the old logic was
  // 1. i get the plan month period
  // 2. I create structure for the weeks
  // 3. I create the days using plan-day service
  // 4. I fill the weeks structure with the days structure
  // its deeply nested and inter connected
  // what altervaitves do you have?
  // why shoul I have a plan-month?
  // it's simply the milestone with extra property called data
  // my current frontend deeply connected with the data structuer
  // [{week: [day]}, {week: [day]...}]
  // in the frontend I am breaking the [{week: [day]}, {week: [day]...}] to days: [day, day, day]
  // in other word flattening it
  // why I just don't send the data in milestone like this
  // milestone: {...restOfdata, plans: [day, day, day, day...]}
  // that will reduce the complexity significantly
  // we can dorp the plan-month entirely
  // awesome
  // how can we do it?
  // do we need to create 31 planDay in milestones at one go?
  // or should we create one plan-day only when the user navigate to that day?
  // well inorder to enable the navigator the days data in milestones should be indexed
  // meaning plan: [{day1}, {day2}]
  // nice we can create them with id: null
  // and in frotned we can create plan-day when the id null so we don't bulk create plan days
};
