const httpStatus = require('http-status');
const { differenceInDays } = require('date-fns');

const ApiError = require('../../utils/ApiError');
const { Roadmap, User } = require('../../models');
const planMonthService = require('../plan-month');

const calcBMR = require('./utils/calc-bmr');
const createMilestone = require('./create-milestone');
const calcCalories = require('./utils/calc-calories');
const genRoadmapOverview = require('./gen-roadmap-overview');
const calcActivityLevel = require('./utils/calc-activity-level');
const calcWeightProgression = require('./calc-weight-progression');
const calcInitialCalories = require('./utils/calc-initial-calories');
const combineWeightProgression = require('./utils/combine-weight-progression');
const updateChangePointMilestone = require('./utils/update-change-point-milestone');
const calcChangePointTargetWeight = require('./utils/update-change-point-target-weight');

/**
 * Create new Roadmap for a user
 * @param {Object} userDetails
 * @param {number} [userDetails.age]
 * @param {number} [userDetails.height]
 * @param {string} [userDetails.gender]
 * @param {ObjectId} [userDetails.userId]
 * @param {number} [userDetails.startWeight]
 * @param {number} [userDetails.targetWeight]
 * @param {number} [userDetails.activityLevel]
 * @param {boolean} [userDetails.isWeightLifting]
 * @param {string} [userDetails.goalAchievementSpeed]
 * @returns {Promise<Roadmap>}
 */
const createRoadmap = async (userDetails) => {
  const {
    age,
    userId,
    height,
    gender,
    startWeight,
    targetWeight: userTargetWeight,
    activityLevel,
    isWeightLifting = false,
    goalAchievementSpeed,
  } = userDetails;

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  if (
    [age, userId, height, gender, startWeight, userTargetWeight, activityLevel, goalAchievementSpeed].some(
      (value) => !value,
    )
  ) {
    return { roadmapId: null };
    // throw new ApiError(httpStatus.BAD_REQUEST, 'User neccessary data for creating roadmap are missing');
  }

  // Step 1: limit weight difference to 12 kg
  let targetWeight = userTargetWeight;
  let isWeightChangeOverLimit = false;
  if (Math.abs(startWeight - targetWeight) > 12) {
    targetWeight = startWeight > targetWeight ? startWeight - 12 : startWeight + 12;
    isWeightChangeOverLimit = true;
  }

  // Step 2: gen roadmap overview
  const { endDate, startDate, totalDays, totalMonths, isGainWeight, weightChange, monthlyCalorieAdjustment } =
    genRoadmapOverview(startWeight, targetWeight, goalAchievementSpeed);

  // Step 3: calculate roadmap weight progression
  const weightProgression = calcWeightProgression(startWeight, targetWeight, weightChange, totalMonths);

  // Step 4: create roadmap first milestone
  const milestonDetails = {
    age,
    month: 1,
    gender,
    height,
    startDate,
    totalMonths,
    isGainWeight,
    activityLevel,
    isWeightLifting,
    weightProgression,
    monthlyCalorieAdjustment,
  };

  const milestone = createMilestone(milestonDetails);

  // Step 4:create the roadmap
  const roadmap = {
    userId,
    overview: {
      endDate,
      startDate,
      totalDays,
      totalMonths,
      startWeight,
      targetWeight,
      weightProgression,
      monthlyCalorieAdjustment,
    },
    milestones: [milestone],
    onGoingMonth: 1,
    onGoingDay: 1,
    activityLog: [{ date: startDate, active: false }],
    isWeightChangeOverLimit,
  };

  const createdRoadmap = await Roadmap.create(roadmap);

  user.roadmapId = createdRoadmap._id;
  Object.assign(user, userDetails);
  await user.save();

  return { roadmapId: createdRoadmap._id };
};

/**
 * Update Roadmap data
 * @param {ObjectId} roadmapId
 * @param {Object} updateBody
 * @param {ObjectId}  [updateBody.userId] - The ID of the user to update the roadmap for
 * @param {Number}  [updateBody.currentWeight] - The ID of the user to update the roadmap for
 * @param {Number}  [updateBody.newTargetWeight] - The ID of the user to update the roadmap for
 * @returns {Promise<Roadmap | void>}
 */
const updateRoadmap = async (roadmapId, updateBody) => {
  const { userId, currentWeight, newTargetWeight } = updateBody;

  try {
    // Step 1: fetch user data
    const user = await User.findById(userId).lean();
    if (!user) {
      throw new Error('User not found');
    }
    const { goalAchievementSpeed } = user;

    // Step 3: fetch roadmap data
    const roadmap = await Roadmap.findById(roadmapId);

    if (!roadmap) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Roadmap not found');
    }

    // Step 4: get roadmap neccessary data
    const { onGoingDay, onGoingMonth, milestones: oldMilestones } = roadmap;

    const {
      startDate,
      startWeight,
      targetWeight: oldTargetWeight,
      weightProgression: oldWeightProgression,
    } = roadmap.overview;

    // Step 5: find the chaging poiont
    const changeIndex = onGoingMonth;
    const leftDays = onGoingMonth * 30 - onGoingDay;
    const changePointDay = 30 - leftDays;

    // Step 6: claculate the weight progression changing point(where initialize roadmap update)
    const changePointTargetWeight = calcChangePointTargetWeight(
      leftDays,
      startWeight,
      currentWeight,
      oldTargetWeight,
      newTargetWeight,
      oldWeightProgression[changeIndex].weightChange,
    );

    const changePointWeightProgression = {
      month: onGoingMonth,
      targetWeight: changePointTargetWeight,
      weightChange: +(changePointTargetWeight - currentWeight).toFixed(1),
      changePoint: { day: changePointDay, weight: currentWeight },
    };

    const changePointMilestone = oldMilestones[changeIndex - 1];

    // Step 7: generate new roadmap overview from the start of new month
    const roadmapOverview = genRoadmapOverview(
      changePointTargetWeight,
      newTargetWeight,
      goalAchievementSpeed,
      changePointMilestone.endDate,
    );

    const {
      endDate,
      weightChange,
      monthlyCalorieAdjustment,
      totalDays: newTotalDays,
      totalMonths: newTotalMonths,
    } = roadmapOverview;

    // Step 8: calculate total days and months
    const totalDays = differenceInDays(endDate, startDate);
    const totalMonths = Math.round(totalDays / 30);

    // Step 9: calculate new weight progression
    const newWeightProgression = calcWeightProgression(
      changePointTargetWeight,
      newTargetWeight,
      weightChange,
      newTotalMonths,
    );

    // Step 10: combine the old weight progression + changePointMonth + new weight progression
    const updatedWeightProgression = combineWeightProgression(
      changeIndex,
      oldWeightProgression,
      newWeightProgression,
      changePointWeightProgression,
    );

    // now we can create the roadmap.overview new values
    const updatedOverviewFields = {
      endDate,
      totalDays,
      totalMonths,
      currentWeight,
      monthlyCalorieAdjustment,
      targetWeight: newTargetWeight,
      weightProgression: updatedWeightProgression,
    };

    Object.assign(roadmap.overview, updatedOverviewFields);

    // update the milestone with new data
    const updatedMilestone = await updateChangePointMilestone(
      user,
      changePointMilestone,
      changePointWeightProgression,
      monthlyCalorieAdjustment[changeIndex - 1],
    );

    roadmap.milestones[changeIndex - 1] = updatedMilestone;

    return await roadmap.save();
  } catch (error) {
    console.error('Error updating roadmap:', error.message);
    throw error; // You might want to handle this differently based on your app
  }
};

/**
 * Query for roadmaps
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryRoadmaps = async (options) => await Roadmap.paginate(null, options);

/**
 * Get roadmap by id
 * @param {ObjectId} id
 * @returns {Promise<Roadmap>}
 */
const getRoadmap = async (id) => {
  // Fetch the roadmap
  const roadmap = await Roadmap.findById(id);
  if (!roadmap) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Roadmap not found');
  }

  // Destructure required roadmap data
  const { _id: roadmapId, userId, onGoingMonth, milestones, overview } = roadmap;
  const { weightProgression, startDate, totalMonths, monthlyCalorieAdjustment } = overview;

  // Fetch the user
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Destructure required user data
  const { age, gender, height, isGainWeight, activityLevel, isWeightLifting } = user;

  // Get or create the current milestone
  let currMilestone = milestones[onGoingMonth - 1];

  if (!currMilestone) {
    currMilestone = createMilestone({
      age,
      month: onGoingMonth,
      gender,
      height,
      startDate,
      totalMonths,
      isGainWeight,
      activityLevel,
      isWeightLifting,
      weightProgression,
      monthlyCalorieAdjustment,
    });

    roadmap.milestones.push(currMilestone);
  }

  // If milestone doesn't have an associated plan, create it
  if (!currMilestone.planId) {
    const {
      _id: milestoneId,
      startDate: milestoneStartDate,
      endDate,
      targetCalories,
      macrosRatio,
      changePoint,
    } = currMilestone;

    const plan = await planMonthService.createPlan({
      userId,
      roadmapId,
      milestoneId,
      startDate: milestoneStartDate,
      endDate,
      calories: changePoint ? changePoint.targetCalories : targetCalories,
      macrosRatio,
    });

    // Assign the planId to the current milestone
    currMilestone.planId = plan._id;
  }

  // Save the updated roadmap with the new milestone and plan data
  await roadmap.save();

  return roadmap;
};

/**
 * Update roadmap milestone by id
 * @param {Object}
 * @returns {Promise<Roadmap>}
 */
const updateRoadmapMilestone = async (userId) => {
  // Step 1: Get the roadmap details
  const roadmap = await Roadmap.findOne({ userId });
  if (!roadmap) {
    throw new ApiError(httpStatus.NOT_FOUND, `Roadmap for user with id ${userId} not found`);
  }

  const { onGoingMonth, milestones } = roadmap;

  // Step 2: Get the ongoing milestone
  const milestoneToBeUpdated = milestones[onGoingMonth - 1];
  if (!milestoneToBeUpdated) {
    throw new ApiError(httpStatus.NOT_FOUND, `Milestone for month ${onGoingMonth} not found`);
  }

  const { startWeight, targetWeight, startDate } = milestoneToBeUpdated;
  const isGainWeight = targetWeight > startWeight;

  // Step 3: Get the user details
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, `User with id ${userId} not found`);
  }

  const { age, height, gender, activityLevel, goalAchievementSpeed } = user;
  const initCalorie = calcInitialCalories(goalAchievementSpeed);
  const activityMultiplier = calcActivityLevel(activityLevel);

  // Step 4: Calculate new milestone data
  const BMR = calcBMR(startWeight, height, age, gender);
  const calorieAdjustment = ((onGoingMonth - 1) * 100 + initCalorie) * (isGainWeight ? 1 : -1);
  const { baseCalories, targetCalories } = calcCalories(BMR, activityMultiplier, calorieAdjustment);

  // Step 5: Create new field `changePoint`
  const changePoint = {
    baseCalories,
    targetCalories,
    date: new Date().toISOString(),
  };

  // Step 6: Update the milestone with the new field
  milestoneToBeUpdated.changePoint = changePoint;

  // Step 7: If planId is not null, update the plan month data
  const changeDay = differenceInDays(new Date(), startDate) + 1;
  const { planId, macrosRatio } = milestoneToBeUpdated;

  if (planId) {
    try {
      await planMonthService.updatePlanMacros(planId, changeDay, targetCalories, macrosRatio);
    } catch (error) {
      console.error(`Failed to update plan macros for planId ${planId}:`, error);
    }
  }

  // Step 8: Save the updated roadmap
  roadmap.markModified('milestones');
  await roadmap.save();
};

const updateActivityLog = async (roadmapId, updateBody) => {
  const { active, index } = updateBody;

  const result = await Roadmap.updateOne({ _id: roadmapId }, { $set: { [`activityLog.${index}.active`]: active } });

  if (!result.n) {
    throw new ApiError(httpStatus.NOT_FOUND, `Roadmap with id ${roadmapId} not found`);
  }

  if (!result.nModified) {
    throw new ApiError(httpStatus.NOT_FOUND, `index ${index} not found`);
  }
};

module.exports = {
  createRoadmap,
  getRoadmap,
  queryRoadmaps,
  updateRoadmap,
  updateRoadmapMilestone,
  updateActivityLog,
};
