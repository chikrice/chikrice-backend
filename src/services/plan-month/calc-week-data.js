const { addDays } = require('date-fns');
const calcDayData = require('./calc-day-data');

const calcWeekData = async (week, currentDay, totalDays, calories, macrosRatio, userId) => {
  // Step 1: initialize week general data
  const weekData = {
    weekNumber: week,
    startDate: currentDay, // Week start date
    endDate: addDays(currentDay, 6), // Week end date
    days: [],
  };

  // Step 2: create days template for each day of the week
  for (let day = 0; day < 7 && totalDays > 0; day++) {
    // Step 3: get the saved day data and push it to days day
    const dayNumber = (week - 1) * 7 + day + 1;
    const planDay = await calcDayData(day, currentDay, calories, macrosRatio, userId);

    const dayData = {
      id: planDay._id,
      name: planDay.name,
      date: planDay.date,
      number: dayNumber,
    };

    weekData.days.push(dayData);

    // Step 4: update currentDay and totalDays
    currentDay = addDays(currentDay, 1);
    totalDays--;

    // Stop if there is no day left
    if (totalDays <= 0) {
      break;
    }
  }

  return weekData;
};

module.exports = calcWeekData;
