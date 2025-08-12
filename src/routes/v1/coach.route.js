const express = require('express');

const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { coachValidation } = require('../../validations');
const { coachController } = require('../../controllers');

const router = express.Router();

router.route('/').get(auth(''), validate(coachValidation.queryCoach), coachController.queryCoach);

router.route('/coach/:coachId').get(auth('getCoach'), validate(coachValidation.getCoach), coachController.getCoach);

router.route('/client').get(auth('getCoach'), validate(coachValidation.getCoachClient), coachController.getCoachClient);

router
  .route('/clients/:coachId')
  .get(auth('getCoach'), validate(coachValidation.queryCoachClients), coachController.queryCoachClients);

module.exports = router;
