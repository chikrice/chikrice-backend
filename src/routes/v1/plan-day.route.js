const express = require('express');

const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { planDayValidation } = require('../../validations');
const { planDayController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth(''), validate(planDayValidation.createPlan), planDayController.createPlan)
  .get(auth(''), validate(planDayValidation.queryPlans), planDayController.queryPlans);

router
  .route('/meal/toggle-mode/:planId')
  .patch(auth(''), validate(planDayValidation.toggleMealMode), planDayController.toggleMealMode);

router
  .route('/meal/toggle-ingredient/:planId')
  .patch(
    auth(''),
    validate(planDayValidation.togglePlanDayMealIngredient),
    planDayController.togglePlanDayMealIngredient,
  );

router
  .route('/meal/switch/:planId')
  .patch(auth(''), validate(planDayValidation.switchMeal), planDayController.switchMeal);

router
  .route('/meal/ai-entry/:planId')
  .patch(auth(''), validate(planDayValidation.submitMealWithAi), planDayController.submitMealWithAi);

router
  .route('/meal/add-suggested/:planId')
  .patch(
    auth(''),
    validate(planDayValidation.addSuggestedMealToPlanDayMeals),
    planDayController.addSuggestedMealToPlanDayMeals,
  );

router
  .route('/meal/shuffle/:planId')
  .patch(auth(''), validate(planDayValidation.changeAllMeals), planDayController.changeAllMeals);

router.route('/meal/copy/:planId').patch(auth(''), validate(planDayValidation.copyMeals), planDayController.copyMeals);

router
  .route('/meal/:planId')
  .post(auth(''), validate(planDayValidation.initCustomMeal), planDayController.initCustomMeal)
  .patch(auth(''), validate(planDayValidation.updatePlanDayMeal), planDayController.updatePlanDayMeal)
  .delete(auth(''), validate(planDayValidation.deletePlanDayMeal), planDayController.deletePlanDayMeal);

router
  .route('/chikrice/:planId')
  .patch(auth(''), validate(planDayValidation.chikricePlanGenerator), planDayController.chikricePlanGenerator);

router
  .route('/:planId')
  .get(auth(''), validate(planDayValidation.getPlan), planDayController.getPlan)
  .post(auth(''), validate(planDayValidation.toggleSavePlanDay), planDayController.toggleSavePlanDay)
  // .patch(auth(''), validate(planDayValidation.chikricePlanner), planDayController.chikricePlanner)
  .delete(auth(''), validate(planDayValidation.deletePlan), planDayController.deletePlan);

module.exports = router;
