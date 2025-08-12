const Joi = require('joi');

const submitQuestion = {
  body: Joi.object().keys({
    question: Joi.string().required(),
  }),
};

module.exports = {
  submitQuestion,
};
