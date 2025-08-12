// Helper function to clean meal object (remove unnecessary fields)
const getCleanMealObject = (meal) => {
  const { _id: id, mealNumbers, __v, ...cleanMeal } = meal;
  return { id, ...cleanMeal };
};

module.exports = getCleanMealObject;
