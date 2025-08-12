const ratioSplitRules = {
  loseWeight: {
    male: {
      gym: {
        start: { carb: 45, pro: 35, fat: 20 },
        end: { carb: 35, pro: 45, fat: 20 },
      },
      noGym: {
        start: { carb: 50, pro: 30, fat: 20 },
        end: { carb: 40, pro: 40, fat: 20 },
      },
    },
    female: {
      gym: {
        start: { carb: 45, pro: 30, fat: 25 },
        end: { carb: 30, pro: 45, fat: 25 },
      },
      noGym: {
        start: { carb: 45, pro: 30, fat: 25 },
        end: { carb: 35, pro: 40, fat: 25 },
      },
    },
  },
  gainWeight: {
    male: {
      gym: {
        start: { carb: 45, pro: 35, fat: 20 },
        end: { carb: 55, pro: 25, fat: 20 },
      },

      noGym: {
        start: { carb: 50, pro: 30, fat: 20 },
        end: { carb: 60, pro: 20, fat: 20 },
      },
    },
    female: {
      gym: {
        start: { carb: 40, pro: 35, fat: 25 },
        end: { carb: 50, pro: 25, fat: 25 },
      },
      noGym: {
        start: { carb: 45, pro: 30, fat: 25 },
        end: { carb: 55, pro: 20, fat: 25 },
      },
    },
  },
};

const calcMacrosRatio = (month, totalMonths, isGainWeight, gender, isWeightLifting) => {
  const goal = isGainWeight ? 'gainWeight' : 'loseWeight';
  const gymStatus = isWeightLifting ? 'gym' : 'noGym';
  let increment;

  const { start, end } = ratioSplitRules[goal][gender][gymStatus];

  // assign the incrmentor value
  if (totalMonths < 7) {
    increment = 2;
  } else {
    // '10' is the rounded gap between start and end carb/protein ratios, divided by total months to get monthly increment.
    increment = 11 / totalMonths;
  }

  let { carb } = start;
  let { pro } = start;
  const { fat } = start;

  if (isGainWeight) {
    carb += (month - 1) * increment;
    pro -= (month - 1) * increment;
  } else {
    carb -= (month - 1) * increment;
    pro += (month - 1) * increment;
  }

  if (totalMonths > 6 && month === totalMonths) {
    pro = end.pro;
    carb = end.carb;
  }

  return { carb: Math.round(carb), pro: Math.round(pro), fat };
};

module.exports = calcMacrosRatio;
