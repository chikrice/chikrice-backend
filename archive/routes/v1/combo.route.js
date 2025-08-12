const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { comboValidation } = require('../../validations');
const { comboController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth(''), validate(comboValidation.createCombo), comboController.createCombo)
  .get(auth(''), validate(comboValidation.queryCombo), comboController.queryCombo);

router
  .route('/:comboId')
  .get(auth(''), validate(comboValidation.getCombo), comboController.getCombo)
  .patch(auth(''), validate(comboValidation.updateCombo), comboController.updateCombo)
  .delete(auth(''), validate(comboValidation.deleteCombo), comboController.deleteCombo);

module.exports = router;
