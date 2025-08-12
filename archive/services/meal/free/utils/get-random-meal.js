// Helper function to randomly select one item from an array
const getRandomMeal = (meals) => {
  const randomIndex = Math.floor(Math.random() * meals.length);
  console.log('🚀 ~ getRandomMeal ~ meals.length:', meals.length);
  return meals[randomIndex];
};

module.exports = getRandomMeal;
