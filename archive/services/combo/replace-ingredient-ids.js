const { Ingredient } = require('../../models'); // Import your Ingredient model

/**
 * Replace ingredient IDs with their actual data and remove private fields
 * @param {Object} data - The data containing ingredient IDs
 * @returns {Object} - The data with IDs replaced by actual ingredient details
 */
const replaceIngredientIds = async (data) => {
  // Destructure ingredients from the data
  const { ingredients } = data;

  // Extract all ingredient IDs from each category
  const ingredientIds = [
    ...ingredients.carb.map((item) => item.ingredient),
    ...ingredients.pro.map((item) => item.ingredient),
    ...ingredients.fat.map((item) => item.ingredient),
  ];

  // Fetch ingredient details from the database
  const ingredientDetails = await Ingredient.find({ _id: { $in: ingredientIds } }).lean();

  // Create a map for quick lookup
  const ingredientMap = ingredientDetails.reduce((acc, ingredient) => {
    const { _id, __v, ...restOfIngredient } = ingredient;

    // Replace _id with id and remove private fields
    acc[_id.toString()] = {
      id: _id.toString(),
      ...restOfIngredient, // Add the remaining fields of the ingredient
    };
    return acc;
  }, {});

  // Replace IDs with actual data
  const replaceIds = (items) =>
    items.map((item) => ({
      ...item,
      ingredient: ingredientMap[item.ingredient.toString()] || null,
    }));

  const { _id: id, __v, ...restOfData } = data;

  return {
    ...restOfData,
    id,
    ingredients: {
      carb: replaceIds(ingredients.carb),
      pro: replaceIds(ingredients.pro),
      fat: replaceIds(ingredients.fat),
    },
  };
};

module.exports = replaceIngredientIds;
