import httpStatus from 'http-status';

import ApiError from '@/utils/ApiError';
import { Roadmap, User } from '@/models';

import { createRoadmapOverview } from './overview';
import { createRoadmapMilestones } from './milestone';

import type { PaginateOptions, QueryResult, RoadmapType } from 'chikrice-types';
import type { CreateRoadmapDTO, UpdateActivityLogDTO } from '@/validations/roadmap.validation';

// -------------------------------------

// ============================================
// ROADMAP CREATION
// ============================================
export const createRoadmap = async (input: CreateRoadmapDTO) => {
  const { userId } = input;
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  const overview = createRoadmapOverview(input);

  const milestones = createRoadmapMilestones(input, overview);

  const data = {
    userId,
    overview,
    milestones,
    activityLog: [
      {
        date: overview.startDate,
        consumedCalories: 0,
        targetCalories: milestones[0].targetCalories,
        completionPercentage: 0,
      },
    ],
  };

  const roadmap = await Roadmap.create(data);

  user.roadmapId = roadmap._id;

  await user.save();

  return roadmap;
};

// ============================================
// ROADMAP QUERYING
// ============================================
export const queryRoadmaps = async (filter: unknown, options: PaginateOptions): Promise<QueryResult<RoadmapType>> => {
  const roadmaps = await Roadmap.paginate(filter, options);
  return roadmaps;
};

export const getRoadmapById = async (id: string): Promise<RoadmapType | null> => {
  const roadmap = await Roadmap.findById(id);
  if (!roadmap) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Roadmap not found');
  }
  return roadmap;
};

// ============================================
// ROADMAP UPDATES
// ============================================
// TODO: Update Roadmap

// ROADMAP DELETATION
// ============================================
export const deleteRoadmapById = async (id: string): Promise<void> => {
  const roadmap = await Roadmap.findById(id);
  if (!roadmap) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Roadmap not found');
  }
  await Roadmap.findByIdAndDelete(id);

  const user = await User.findById(roadmap.userId);

  if (user) {
    user.roadmapId = null;
    await user.save();
  }
};

// ============================================
// ROADMAP ACTIVITY LOG
// ============================================
export const updateActivityLog = async (roadmapId: string, data: UpdateActivityLogDTO): Promise<void> => {
  const { index, consumedCalories, targetCalories } = data;
  const completionPercentage = (consumedCalories / targetCalories) * 100;
  const result = await Roadmap.updateOne(
    { _id: roadmapId },
    {
      $set: {
        [`activityLog.${index}.consumedCalories`]: consumedCalories,
        [`activityLog.${index}.completionPercentage`]: completionPercentage,
      },
    },
  );

  if (!result.n) {
    throw new ApiError(httpStatus.NOT_FOUND, `Roadmap with id ${roadmapId} not found`);
  }

  if (!result.nModified) {
    throw new ApiError(httpStatus.NOT_FOUND, `index ${index} not found`);
  }
};
