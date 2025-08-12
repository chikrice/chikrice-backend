const { Faq } = require('../models');

/**
 * @param {Object} faqBody
 * @returns void
 */
const submitQuestion = async (faqBody) => {
  const { question } = faqBody;
  await Faq.create({ question });
};

module.exports = {
  submitQuestion,
};
