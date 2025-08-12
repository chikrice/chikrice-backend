const calcMonthProgressFactor = require('./utils/calc-month-progress-factor');

const calcWeightProgression = (startWeight, targetWeight, weightChange, totalMonths) => {
  const isLosingWeight = targetWeight < startWeight;

  if (weightChange <= 2) {
    return [
      { month: 0, targetWeight: startWeight, weightChange: 0 },
      { month: 1, targetWeight, weightChange },
    ];
  }

  // Create an array to store the weight progression
  const progression = [];

  // Calculate weight for each month
  for (let month = 1; month <= totalMonths; month++) {
    const monthFactor = calcMonthProgressFactor(month, totalMonths);
    const monthWeightChange = weightChange * monthFactor;
    const currentWeight = isLosingWeight ? startWeight - monthWeightChange : startWeight + monthWeightChange;

    // Store both the current weight and the weight change for the month
    progression.push({
      month,
      targetWeight: parseFloat(currentWeight.toFixed(1)),
      weightChange:
        month === 1
          ? parseFloat((currentWeight - startWeight).toFixed(1)) // Change from the initial weight for the first month
          : parseFloat((currentWeight - progression[month - 2].targetWeight).toFixed(1)), // Change from the previous month for subsequent months
    });
  }

  // Ensure the last value is exactly the target weight and calculate the final weight change
  const lastMonthIndex = totalMonths - 1;
  progression[lastMonthIndex] = {
    month: totalMonths,
    targetWeight: parseFloat(targetWeight.toFixed(1)),
    weightChange: parseFloat((targetWeight - progression[lastMonthIndex - 1].targetWeight).toFixed(1)),
  };

  progression.unshift({ month: 0, targetWeight: startWeight, weightChange: 0 });

  return progression;
};

module.exports = calcWeightProgression;
