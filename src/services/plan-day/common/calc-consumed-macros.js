/**
 * Calculates the total consumed macros (calories, carbs, protein, fat) from an array of meals.
 * Only meals marked as consumed are included in the totals.
 *
 * @param {Array} meals - Array of meal objects, `activeMeal` with `macros`.
 * @returns {Object} - An object containing the total macros: { cal, carb, pro, fat }.
 */
const calcConsumedMacros = (meals) =>
  meals.reduce(
    (acc, { activeMeal: { macros } }) => {
      acc.cal += macros.cal;
      acc.carb += macros.carb;
      acc.pro += macros.pro;
      acc.fat += macros.fat;
      return acc;
    },
    { cal: 0, carb: 0, pro: 0, fat: 0 }
  );

module.exports = calcConsumedMacros;
