const httpStatus = require('http-status');

const ApiError = require('../utils/ApiError');
const { BaseUser, Coach, User } = require('../models');

/**
 * Query for coaches
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryCoach = async (options) => {
  const coaches = await Coach.paginate({}, options);
  return coaches;
};

/**
 * get coache by id
 * @param {string} coachId
 * @returns {Promise<Coach>}
 */
const getCoachById = async (coachId) => await Coach.findById(coachId);

/**
 * Create a coach
 * @param {Object} coachBody
 * @returns {Promise<Coach>}
 */
const createCoach = async (coachBody, registerMethod) => {
  if (await BaseUser.isEmailTaken(coachBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }

  const registrationMethod = registerMethod || 'manual';

  const coach = await Coach.create({ ...coachBody, registrationMethod });

  return coach;
};

/**
 * get coache client
 * @param {string} coachId
 * @param {string} clientId
 * @returns {Promise<User>}
 */
const getCoachClient = async (coachId, clientId) => {
  const client = await User.findById(clientId);
  if (!client) throw new ApiError(httpStatus.NOT_FOUND, 'Client not found');

  if (client.currentCoach.id !== coachId) throw new ApiError(httpStatus.UNAUTHORIZED);

  const clientData = {
    id: clientId,
    age: client.age,
    name: client.name,
    height: client.height,
    gender: client.gender,
    roadmapId: client.roadmapId,
    startWeight: client.startWeight,
    targetWeight: client.targetWeight,
    currentWeight: client.currentWeight,
    activityLevel: client.activityLevel,
    isWeightLifting: client.isWeightLifting,
    goalAchievementSpeed: client.goalAchievementSpeed,
  };

  return clientData;
};

const queryCoachClients = async (coachId, options) => {
  const { sortBy = 'name:asc', limit = 10, page = 1 } = options;

  const coach = await Coach.findById(coachId).populate({
    path: 'clients',
    select: 'name picture',
  });

  if (!coach) throw new ApiError(httpStatus.NOT_FOUND, 'Coach not found');

  const { clients } = coach;

  // Sort clients array based on the sortBy field
  const [field, order] = sortBy.split(':');
  clients.sort((a, b) => {
    if (order === 'desc') return b[field] > a[field] ? 1 : -1;
    return a[field] > b[field] ? 1 : -1;
  });

  // Apply pagination
  const startIndex = (page - 1) * limit;
  const paginatedClients = clients.slice(startIndex, startIndex + limit);

  return {
    results: paginatedClients,
    limit,
    page,
    totalPages: Math.ceil(clients.length / limit),
    totalResults: clients.length,
  };
};

module.exports = {
  queryCoach,
  createCoach,
  getCoachById,
  getCoachClient,
  queryCoachClients,
};
