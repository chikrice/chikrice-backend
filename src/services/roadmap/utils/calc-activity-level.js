const calcActivityLevel = (activityLevel) => {
  const activityMultiplier = [1.2, 1.375, 1.55, 1.725, 1.9][activityLevel - 1];

  return activityMultiplier;
};

module.exports = calcActivityLevel;
