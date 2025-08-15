const express = require('express');

const config = require('../../config/config');

const faqRoute = require('./faq.route');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const docsRoute = require('./docs.route');
const planRoute = require('./plan.route');
const coachRoute = require('./coach.route');
const healthRoute = require('./health.route');
const roadmapRoute = require('./roadmap.route');
const planDayRoute = require('./plan-day.route');
const planMonthRoute = require('./plan-month.route');
const ingredientRoute = require('./ingredient.route');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/faqs',
    route: faqRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/coaches',
    route: coachRoute,
  },
  {
    path: '/roadmaps',
    route: roadmapRoute,
  },
  {
    path: '/plans-day',
    route: planDayRoute,
  },
  {
    path: '/plans',
    route: planRoute,
  },
  {
    path: '/ingredients',
    route: ingredientRoute,
  },
  {
    path: '/plans-month',
    route: planMonthRoute,
  },
  {
    path: '/health',
    route: healthRoute,
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
  {
    path: '/health',
    route: healthRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
