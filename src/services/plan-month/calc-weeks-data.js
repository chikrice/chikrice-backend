const { addDays } = require('date-fns');

const calcWeekData = require('./calc-week-data');

// Function to generate weeks data with days and empty meals
const calcWeeksData = async (totalWeeks, totalDays, startDate, calories, macrosRatio, userId) => {
  // Step 1: initialize entire body data
  const weeksData = [];
  let currentDay = new Date(startDate);

  // Step 2: create week templates as many as totalWeeks count
  for (let week = 1; week <= totalWeeks; week++) {
    // Step 3: calc weekData
    // eslint-disable-next-line
    const weekData = await calcWeekData(week, currentDay, totalDays, calories, macrosRatio, userId);

    // Step 4: push the week into weeks data
    weeksData.push(weekData);

    // Step 5: decrease 7 days from total days and add 7 days to current day
    // eslint-disable-next-line
    totalDays -= 7;
    currentDay = addDays(currentDay, 7);
  }

  return weeksData;
};

module.exports = calcWeeksData;
