const { differenceInCalendarDays } = require('date-fns');

/**
 *
 * @param {Date|string} startDate - Plan start date
 * @param {Date|string} endDate - Plan end date
 * @returns {Object} - totalDays, totalWeeks
 */
const calcPlanDuration = (startDate, endDate) => {
  const totalDays = differenceInCalendarDays(new Date(endDate), new Date(startDate));
  const totalWeeks = Math.ceil(totalDays / 7);

  return { totalDays, totalWeeks };
};

module.exports = calcPlanDuration;
