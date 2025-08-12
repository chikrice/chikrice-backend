const { coachService } = require('../services');
const catchAsync = require('../utils/catchAsync');
const pick = require('../utils/pick');

const queryCoach = catchAsync(async (req, res) => {
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await coachService.queryCoach(options);
  res.send(result);
});

const getCoach = catchAsync(async (req, res) => {
  const result = await coachService.getCoachById(req.params.coachId);
  res.send(result);
});

const getCoachClient = catchAsync(async (req, res) => {
  const { coachId, clientId } = pick(req.query, ['coachId', 'clientId']);
  const client = await coachService.getCoachClient(coachId, clientId);
  res.send(client);
});

const queryCoachClients = catchAsync(async (req, res) => {
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await coachService.queryCoachClients(req.params.coachId, options);
  res.send(result);
});

module.exports = {
  getCoach,
  queryCoach,
  getCoachClient,
  queryCoachClients,
};
