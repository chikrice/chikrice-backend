/**
 * Calculates the month progress factor to smooth out the weight change over time.
 *
 * @param {number} month - The current month of the plan
 * @param {number} totalMonths - The total months in the old plan
 * @returns {number} - The month progress factor
 */
const calcMonthProgressFactor = (month, totalMonths) => {
  const logBase = 0.76;
  return Math.log(month + logBase) / Math.log(totalMonths + logBase);
};

module.exports = calcMonthProgressFactor;
