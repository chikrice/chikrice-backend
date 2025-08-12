const { Roadmap } = require('./roadmap');
const { BaseUser, User, Coach, Admin } = require('./user');

// Exporting all models, including the user models
module.exports = {
  User,
  Coach,
  Admin,
  BaseUser,
  Roadmap,
  // eslint-disable-next-line global-require
  Faq: require('./faq'),
  // eslint-disable-next-line global-require
  Token: require('./token'),
  // eslint-disable-next-line global-require
  PlanDay: require('./plan-day'),
  // eslint-disable-next-line global-require
  PlanMonth: require('./plan-month'),
  // eslint-disable-next-line global-require
  Ingredient: require('./ingredient'),
};
