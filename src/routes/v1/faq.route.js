const express = require('express');
const validate = require('../../middlewares/validate');
const { faqValidation } = require('../../validations');
const { faqController } = require('../../controllers');

const router = express.Router();

router.post('/', validate(faqValidation.submitQuestion), faqController.submitQuestion);

module.exports = router;
