const express = require('express');

const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { planMonthValidation } = require('../../validations');
const { planMonthController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth(''), validate(planMonthValidation.createPlan), planMonthController.createPlan)
  .get(auth(''), validate(planMonthValidation.queryPlans), planMonthController.queryPlans);

router
  .route('/:planId')
  .get(auth(''), validate(planMonthValidation.getPlan), planMonthController.getPlan)
  .patch(auth(''), validate(planMonthValidation.getPlan), planMonthController.updatePlan);

router
  .route('/suggestions/:planId')
  .get(auth(''), validate(planMonthValidation.getMealSuggestions), planMonthController.getMealSuggestions);

module.exports = router;
