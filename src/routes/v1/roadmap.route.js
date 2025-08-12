const express = require('express');

const { zodValidate } = require('@/middlewares/validate-zod');

const auth = require('../../middlewares/auth');
const { roadmapValidation } = require('../../validations');
const { roadmapController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth(''), zodValidate(roadmapValidation.createRoadmap), roadmapController.createRoadmap)
  .get(auth(''), zodValidate(roadmapValidation.queryRoadmaps), roadmapController.queryRoadmaps);

router.route('/:roadmapId').get(auth(''), zodValidate(roadmapValidation.getRoadmap), roadmapController.getRoadmap);
// .patch(auth(''), zodValidate(roadmapValidation.updateRoadmap), roadmapController.updateRoadmap);

router
  .route('/activity-log/:roadmapId')
  .patch(auth(''), zodValidate(roadmapValidation.updateActivityLog), roadmapController.updateActivityLog);

module.exports = router;
