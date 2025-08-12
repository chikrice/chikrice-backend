const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { subscriptionValidation } = require('../../validations');
const { subscriptionController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth(''), validate(subscriptionValidation.createSubscription), subscriptionController.createSubscription)
  .get(auth(''), validate(subscriptionValidation.getSubscriptions), subscriptionController.getSubscriptions);

router
  .route('/:subscriptionId')
  .get(auth(''), validate(subscriptionValidation.getSubscription), subscriptionController.getSubscription)
  .patch(auth(''), validate(subscriptionValidation.getSubscription), subscriptionController.updateSubscription);

module.exports = router;
