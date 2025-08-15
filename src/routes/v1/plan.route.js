const express = require('express');

const { zodValidate } = require('@/middlewares/validate-zod');

const auth = require('../../middlewares/auth');
const { planValidation } = require('../../validations');
const { planController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth(''), zodValidate(planValidation.createPlan), planController.createPlan)
  .get(auth(''), zodValidate(planValidation.queryPlans), planController.queryPlans);

router
  .route('/meal/toggle-mode/:planId')
  .patch(auth(''), zodValidate(planValidation.toggleMealMode), planController.toggleMealMode);

router
  .route('/meal/toggle-ingredient/:planId')
  .patch(auth(''), zodValidate(planValidation.togglePlanMealIngredient), planController.togglePlanMealIngredient);

router
  .route('/meal/ai-entry/:planId')
  .patch(auth(''), zodValidate(planValidation.submitMealWithAi), planController.submitMealWithAi);

router
  .route('/meal/add-suggested/:planId')
  .patch(auth(''), zodValidate(planValidation.addSuggestedMealToPlanMeals), planController.addSuggestedMealToPlanMeals);

router.route('/meal/copy/:planId').patch(auth(''), zodValidate(planValidation.copyMeals), planController.copyMeals);

router
  .route('/meal/:planId')
  .post(auth(''), zodValidate(planValidation.initCustomMeal), planController.initCustomMeal)
  .patch(auth(''), zodValidate(planValidation.updatePlanMeal), planController.updatePlanMeal)
  .delete(auth(''), zodValidate(planValidation.deletePlanMeal), planController.deletePlanMeal);

router
  .route('/:planId')
  .get(auth(''), zodValidate(planValidation.getPlan), planController.getPlan)
  .post(auth(''), zodValidate(planValidation.toggleSavePlan), planController.toggleSavePlan)
  .delete(auth(''), zodValidate(planValidation.deletePlan), planController.deletePlan);

module.exports = router;
