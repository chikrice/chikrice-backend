const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { menuValidation } = require('../../validations');
const { menuController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth(''), validate(menuValidation.createMenuItem), menuController.createMenuItem)
  .get(auth(''), validate(menuValidation.getMenu), menuController.getMenu);

router
  .route('/:menuItemId')
  .get(auth(''), validate(menuValidation.getMenuItem), menuController.getMenuItem)
  .patch(auth(''), validate(menuValidation.updateMenuItem), menuController.updateMenuItem);

module.exports = router;
