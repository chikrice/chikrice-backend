const combineWeightProgression = (
  changeIndex,
  oldWeightProgression,
  newWeightProgression,
  changePointWeightProgression
) => {
  // Combine the old weight progression (up to the change index) with the new one

  const updatedWeightProgression = [
    ...oldWeightProgression.slice(0, changeIndex),
    changePointWeightProgression,
    ...newWeightProgression.slice(1),
  ];

  updatedWeightProgression.forEach((milestone, index) => {
    milestone.month = index;
  });

  return updatedWeightProgression;
};

module.exports = combineWeightProgression;
