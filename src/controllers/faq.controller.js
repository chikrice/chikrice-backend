const httpStatus = require('http-status');

const { faqService } = require('../services');
const catchAsync = require('../utils/catchAsync');

const submitQuestion = catchAsync(async (req, res) => {
  await faqService.submitQuestion(req.body);
  res.status(httpStatus.CREATED).send();
});

module.exports = {
  submitQuestion,
};
