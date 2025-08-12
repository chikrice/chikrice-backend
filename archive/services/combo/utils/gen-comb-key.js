const generateComboKey = (ingredients) => {
  return ingredients.sort().join(',');
};

module.exports = generateComboKey;
