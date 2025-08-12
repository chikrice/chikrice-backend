const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { mealValidation } = require('../../validations');
const { mealController } = require('../../controllers');

const router = express.Router();

router.route('/').get(auth(''), validate(mealValidation.queryMeals), mealController.queryMeals);

router.route('/:mealId').get(auth(''), validate(mealValidation.getMeal), mealController.getMeal);

module.exports = router;
