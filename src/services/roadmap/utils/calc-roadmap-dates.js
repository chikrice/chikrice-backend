/**
 * Calculate the start and end dates of the roadmap
 *
 * @param {number} totalDays
 * @param {Date|string} [inputStartDate] - Optional start date, defaults to current date if not provided.
 * @returns {Object}
 */
const calcRoadmapDates = (totalDays, inputStartDate) => {
  // Ensure start date is either a valid Date object or current date
  const start = inputStartDate ? new Date(inputStartDate) : new Date();
  start.setUTCHours(0, 0, 0, 0);

  // Check if start date is valid
  if (isNaN(start.getTime())) {
    throw new Error('Invalid start date');
  }

  const end = new Date(start);
  end.setDate(start.getDate() + totalDays);

  return { startDate: start.toISOString(), endDate: end.toISOString() };
};

module.exports = calcRoadmapDates;
