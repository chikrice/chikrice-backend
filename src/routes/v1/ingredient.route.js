const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { ingredientValidation } = require('../../validations');
const { ingredientController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .get(auth(''), validate(ingredientValidation.queryIngredients), ingredientController.queryIngredients)
  .post(auth(''), validate(ingredientValidation.createIngredient), ingredientController.createIngredient);

router.route('/categories').get(auth(''), ingredientController.getIngredientsByCategories);

router
  .route('/:ingredientId')
  .get(auth(''), validate(ingredientValidation.getIngredient), ingredientController.getIngredient)
  .patch(auth(''), validate(ingredientValidation.updateIngredient), ingredientController.updateIngredient)
  .delete(auth(''), validate(ingredientValidation.deleteIngredient), ingredientController.deleteIngredient);

router
  .route('/user/search')
  .get(auth(''), validate(ingredientValidation.getIngredientsForUser), ingredientController.getIngredientsForUser);

module.exports = router;
