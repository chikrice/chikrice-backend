const httpStatus = require('http-status');

const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const { roadmapService } = require('../services');
const catchAsync = require('../utils/catchAsync');

const createRoadmap = catchAsync(async (req, res) => {
  const roadmapId = await roadmapService.createRoadmap(req.body);

  res.status(httpStatus.CREATED).send(roadmapId);
});

const getRoadmap = catchAsync(async (req, res) => {
  const roadmap = await roadmapService.getRoadmapById(req.params.roadmapId);
  if (!roadmap) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Roadmap not found');
  }
  res.send(roadmap);
});

const queryRoadmaps = catchAsync(async (req, res) => {
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await roadmapService.queryRoadmaps({}, options);
  res.send(result);
});

// const updateRoadmapMilestone = catchAsync(async (req, res) => {
//   const { roadmapId, milestoneId, data } = req.body;
//   const updatedDoc = await roadmapService.updateRoadmapMilestone(roadmapId, milestoneId, data);

//   res.send(updatedDoc);
// });

// const updateRoadmap = catchAsync(async (req, res) => {
//   const roadmap = await roadmapService.updateRoadmap(req.params.roadmapId, req.body);

//   res.status(httpStatus.OK).send(roadmap);
// });

const updateActivityLog = catchAsync(async (req, res) => {
  await roadmapService.updateActivityLog(req.params.roadmapId, req.body);

  res.status(httpStatus.OK).send();
});

module.exports = {
  createRoadmap,
  getRoadmap,
  queryRoadmaps,
  // updateRoadmap,
  updateActivityLog,
  // updateRoadmapMilestone,
};
