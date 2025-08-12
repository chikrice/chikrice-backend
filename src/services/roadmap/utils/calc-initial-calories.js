const calcInitialCalories = (goalAchievementSpeed) => {
  switch (goalAchievementSpeed) {
    case 'slow':
      return 200;

    case 'recommended':
      return 400;

    case 'fast':
      return 600;

    default:
      return 400;
  }
};

module.exports = calcInitialCalories;
