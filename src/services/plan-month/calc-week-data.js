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

  // Step 2: create array of promises for parallel execution
  const dayPromises = [];
  let tempCurrentDay = currentDay;
  let tempTotalDays = totalDays;

  for (let day = 0; day < 7 && tempTotalDays > 0; day++) {
    const dayNumber = (week - 1) * 7 + day + 1;

    dayPromises.push(
      calcDayData(day, tempCurrentDay, calories, macrosRatio, userId).then((planDay) => ({
        id: planDay._id,
        name: planDay.name,
        date: planDay.date,
        number: dayNumber,
      })),
    );

    // Update variables for next iteration
    tempCurrentDay = addDays(tempCurrentDay, 1);
    tempTotalDays--;
  }

  // Step 3: execute all promises in parallel
  const dayDataArray = await Promise.all(dayPromises);
  weekData.days = dayDataArray;

  return weekData;
};

module.exports = calcWeekData;
