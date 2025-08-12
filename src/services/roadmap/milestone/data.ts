export const ratioSplitRules = {
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
