const { Plan } = require('./plan');
const { Roadmap } = require('./roadmap');
const { PlanMonth } = require('./plan-month');
const { Ingredient } = require('./ingredient');
const { BaseUser, User, Coach, Admin } = require('./user');

// Exporting all models, including the user models
module.exports = {
  User,
  Coach,
  Admin,
  BaseUser,
  Roadmap,
  Plan,
  Ingredient,
  PlanMonth,
  // eslint-disable-next-line global-require
  Faq: require('./faq'),
  // eslint-disable-next-line global-require
  Token: require('./token'),
  // eslint-disable-next-line global-require
  PlanDay: require('./plan-day'),
  // eslint-disable-next-line global-require
};
