const planDayService = require('../plan-day');

const calcMealsAndSnacksCount = require('./calc-meals-snacks-number');

const days = ['saturday', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

const calcDayData = async (day, currentDay, calories, macrosRatio, userId) => {
  // step 1: calculate the default meals and snacks count
  const { mealsCount, snacksCount } = calcMealsAndSnacksCount(calories);

  // Step 2: create plan day object
  const planData = {
    userId,
    number: day + 1,
    name: days[day],
    subscriptionType: 'free',
    date: currentDay,
    calories,
    macrosRatio,
    mealsCount,
    snacksCount,
  };

  // Step 3: create new planDay and save it in db
  const plan = await planDayService.createPlan(planData);

  return plan;
};

module.exports = calcDayData;
