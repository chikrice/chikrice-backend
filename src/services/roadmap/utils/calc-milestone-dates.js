/**
 * Calculates the milestone start and end dates based on a given start date and an index.
 *
 * @param {Date|string} startDate - The initial start date, can be a `Date` object or an ISO string.
 * @param {number} i - The index indicating which milestone month to calculate. Typically `i` starts from 1.
 *
 * @returns {Object} - An object containing:
 */
const calcMilestoneDates = (startDate, i) => {
  const start = new Date(startDate);

  start.setMonth(start.getMonth() + i - 1);
  start.setUTCHours(0, 0, 0, 0);
  const end = new Date(start);

  end.setMonth(start.getMonth() + 1);

  return {
    milestoneStartDate: start.toISOString(),
    milestoneEndDate: end.toISOString(),
  };
};

module.exports = calcMilestoneDates;
