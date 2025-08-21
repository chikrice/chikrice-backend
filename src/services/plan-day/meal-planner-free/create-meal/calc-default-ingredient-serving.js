const { User } = require('../../../../models');
const getCurrentTimeSlot = require('../../../../utils/get-time-slot');

const splitMacrosEqually = require('./split-macros-equally');
const { getBestServingSize } = require('./calc-serving-size-limit');

function calcMealsAndSnacksCount() {
  console.log('ho');
}
const calcDefaultIngredientPortion = async (userId, ingredient, targetMacros) => {
  const user = await User.findById(userId);
  const timeSlot = getCurrentTimeSlot();

  const { mealsCount, snacksCount } = calcMealsAndSnacksCount(targetMacros.cal);
  const { snackMacros } = splitMacrosEqually(mealsCount, snacksCount, targetMacros);

  const { id, name, serving, category, icon, macroType } = ingredient;
  const { weightInGrams, nutrientFacts, breakpoint, singleLabel, multipleLabel } = serving;

  const userPreference = user.mealPreferences?.[timeSlot]?.[macroType]?.[id]?.portionSize || false;

  let portionSize = 0;

  if (!userPreference) {
    if (macroType === 'free' || category === 'vegetables' || category === 'sauces') {
      portionSize = 1;
    } else {
      const macroAmount = snackMacros[macroType];
      const servingAmount = macroAmount / nutrientFacts[macroType];
      portionSize = getBestServingSize(servingAmount, breakpoint);
    }
  } else {
    portionSize = userPreference;
  }

  const ingToPush = {
    id,
    name,
    icon,
    macroType,
    serving,
    isAiGenerated: false,
    portion: {
      qty: portionSize,
      label: {
        en: portionSize >= 2 ? multipleLabel.en : singleLabel.en,
        ar: portionSize >= 2 ? multipleLabel.ar : singleLabel.ar,
        fa: portionSize >= 2 ? multipleLabel.fa : singleLabel.fa,
      },
      weightInGrams: portionSize * weightInGrams,
    },
    macros: {
      cal: nutrientFacts.cal * portionSize,
      carb: nutrientFacts.carb * portionSize,
      pro: nutrientFacts.pro * portionSize,
      fat: nutrientFacts.fat * portionSize,
    },
  };

  return ingToPush;
};

module.exports = calcDefaultIngredientPortion;
