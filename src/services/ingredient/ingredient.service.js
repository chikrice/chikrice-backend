const httpStatus = require('http-status');

const ApiError = require('../../utils/ApiError');
const { Ingredient, User } = require('../../models');
const getCurrentTimeSlot = require('../../utils/get-time-slot');

/**
 * Create a new ingredient in the database.
 *
 * @param {Object} ingredient - The ingredient object to be created.
 * @returns {Object} - The newly created ingredient object.
 * @throws {ApiError} - Throws error if the ingredient name already exists.
 */
const createIngredient = async (ingredient) => {
  // Extract the name of the ingredient
  const { name } = ingredient;

  // Check if an ingredient with the same English name already exists in the database
  const existingIngredient = await Ingredient.findOne({ 'name.en': name.en });

  // If the ingredient already exists, throw an error to prevent duplicates
  if (existingIngredient) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Meal name already exists');
  }

  // If no duplicate is found, create and save the new ingredient in the database
  return Ingredient.create(ingredient);
};

/**
 * Query for ingredients
 * @param {Object} filter - Mongo filter
 * @param {string} [filter.mealType] - [snack, meal]
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryIngredients = async (filter, options) => {
  const { name, ...otherFilters } = filter;
  const { page, limit, sortBy } = options;

  const nameFilter = name
    ? {
        $or: [
          { 'name.en': { $regex: name, $options: 'i' } },
          { 'name.ar': { $regex: name } },
          { 'name.fa': { $regex: name } },
        ],
      }
    : {};

  const fullFilter = {
    ...otherFilters,
    ...nameFilter,
  };

  // Parse sorting options
  let sort = '';
  if (sortBy) {
    const [sortField, sortOrder] = sortBy.split(':');
    sort = { [sortField]: sortOrder === 'desc' ? -1 : 1 };
  }

  // Calculate pagination values
  const skip = (page - 1) * limit;

  // Count total results
  const totalResults = await Ingredient.countDocuments(fullFilter);

  // Fetch the paginated results
  const results = await Ingredient.find(fullFilter).sort(sort).skip(skip).limit(limit);

  // Calculate total pages
  const totalPages = Math.ceil(totalResults / limit);

  // Return the result in the required format
  return {
    results,
    page,
    limit,
    totalPages,
    totalResults,
  };
};

/**
 * Get ingredient from the database.
 *
 * @param {String} id - The ingredient id to be fetched.
 * @returns {Object} - The founded ingredient object.
 * @throws {ApiError} - Throws error if the ingredient name does not exists.
 */
const getIngredient = async (id) => {
  const existingIngredient = await Ingredient.findById(id);

  // If the ingredient already exists, throw an error to prevent duplicates
  if (!existingIngredient) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Ingredient not found');
  }

  // If no duplicate is found, create and save the new ingredient in the database
  return existingIngredient;
};

/**
 * Get ingredients based on user data.
 *
 * @param {Object} filters - search filters
 * @param {string} [filters.userId]
 * @param {string} [filters.query]
 * @returns {array} - Array of ingredient groups by macroType, in a specific order.
 * @throws {ApiError} - Throws error if the user is not found.
 */
const getIngredientsForUser = async (filters) => {
  const { userId, query } = filters;

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  const filter = {};

  if (query) {
    // Create a more flexible search pattern
    const searchTerms = query.trim().toLowerCase().split(/\s+/);

    // Build regex patterns for each search term
    const searchPatterns = searchTerms.map((term) => {
      // Handle common plural forms and variations
      const singularTerm = term.replace(/s$/, ''); // Remove trailing 's'
      const pluralTerm = term.endsWith('s') ? term : `${term}s`;

      // Create a pattern that matches the term as a whole word or part of a word
      return {
        $or: [
          // Exact match (case insensitive)
          { 'name.en': { $regex: `^${term}$`, $options: 'i' } },
          { 'name.ar': { $regex: `^${term}$`, $options: 'i' } },
          { 'name.fa': { $regex: `^${term}$`, $options: 'i' } },

          // Word boundary match (case insensitive)
          { 'name.en': { $regex: `\\b${term}\\b`, $options: 'i' } },
          { 'name.ar': { $regex: `\\b${term}\\b`, $options: 'i' } },
          { 'name.fa': { $regex: `\\b${term}\\b`, $options: 'i' } },

          // Contains match (case insensitive)
          { 'name.en': { $regex: term, $options: 'i' } },
          { 'name.ar': { $regex: term, $options: 'i' } },
          { 'name.fa': { $regex: term, $options: 'i' } },

          // Handle singular/plural variations
          ...(term !== singularTerm
            ? [
                { 'name.en': { $regex: `^${singularTerm}$`, $options: 'i' } },
                { 'name.ar': { $regex: `^${singularTerm}$`, $options: 'i' } },
                { 'name.fa': { $regex: `^${singularTerm}$`, $options: 'i' } },
                { 'name.en': { $regex: `\\b${singularTerm}\\b`, $options: 'i' } },
                { 'name.ar': { $regex: `\\b${singularTerm}\\b`, $options: 'i' } },
                { 'name.fa': { $regex: `\\b${singularTerm}\\b`, $options: 'i' } },
                { 'name.en': { $regex: singularTerm, $options: 'i' } },
                { 'name.ar': { $regex: singularTerm, $options: 'i' } },
                { 'name.fa': { $regex: singularTerm, $options: 'i' } },
              ]
            : []),

          ...(term !== pluralTerm
            ? [
                { 'name.en': { $regex: `^${pluralTerm}$`, $options: 'i' } },
                { 'name.ar': { $regex: `^${pluralTerm}$`, $options: 'i' } },
                { 'name.fa': { $regex: `^${pluralTerm}$`, $options: 'i' } },
                { 'name.en': { $regex: `\\b${pluralTerm}\\b`, $options: 'i' } },
                { 'name.ar': { $regex: `\\b${pluralTerm}\\b`, $options: 'i' } },
                { 'name.fa': { $regex: `\\b${pluralTerm}\\b`, $options: 'i' } },
                { 'name.en': { $regex: pluralTerm, $options: 'i' } },
                { 'name.ar': { $regex: pluralTerm, $options: 'i' } },
                { 'name.fa': { $regex: pluralTerm, $options: 'i' } },
              ]
            : []),
        ],
      };
    });

    // If multiple search terms, use $and to require all terms to match
    if (searchPatterns.length === 1) {
      filter.$or = searchPatterns[0].$or;
    } else {
      filter.$and = searchPatterns.map((pattern) => ({ $or: pattern.$or }));
    }
  }

  const ingredients = await Ingredient.find(filter);

  // Get user's custom ingredients
  const userCustomIngredients = user.customIngredients || [];

  // Dynamically group ingredients by their macroType
  const groups = ingredients.reduce(
    (acc, ingredient) => {
      const { macroType } = ingredient;
      if (!acc[macroType]) {
        acc[macroType] = [];
      }
      acc[macroType].push(ingredient);
      return acc;
    },
    { carb: [], pro: [], fat: [], free: [], custom: [] },
  );

  // Add user's custom ingredients to the custom group
  if (userCustomIngredients.length > 0) {
    groups.custom = [...groups.custom, ...userCustomIngredients];
  }

  // Get the user meal preferences
  const { mealPreferences } = user;

  // Assume you want to use a specific time slot
  const timeSlot = getCurrentTimeSlot();
  // Sort the ingredients based on user preferences
  const sortByPreferences = (ingredientsArr, macroType) =>
    ingredientsArr.sort((a, b) => {
      const idA = a._id.toString();
      const idB = b._id.toString();
      const countA = mealPreferences[timeSlot]?.[macroType]?.[idA]?.count || 0;
      const countB = mealPreferences[timeSlot]?.[macroType]?.[idB]?.count || 0;
      return countB - countA; // Sort in descending order based on count
    });

  // Sort each group by user preferences
  groups.carb = sortByPreferences(groups.carb, 'carb');
  groups.pro = sortByPreferences(groups.pro, 'pro');
  groups.fat = sortByPreferences(groups.fat, 'fat');
  groups.free = sortByPreferences(groups.free, 'free');
  groups.custom = sortByPreferences(groups.custom, 'custom');

  // Return the result array in the desired order: carb, pro, fat
  const result = [
    { title: 'carb', ingredients: groups.carb },
    { title: 'pro', ingredients: groups.pro },
    { title: 'fat', ingredients: groups.fat },
    { title: 'allowed', ingredients: groups.free },
    { title: 'custom', ingredients: groups.custom },
  ];

  if (query) {
    // For search queries, also include custom ingredients that match the query
    const matchingCustomIngredients = userCustomIngredients.filter(
      (ingredient) =>
        ingredient.name.en.toLowerCase().includes(query.toLowerCase()) ||
        ingredient.name.ar.includes(query) ||
        ingredient.name.fa.includes(query),
    );

    const allMatchingIngredients = [...ingredients, ...matchingCustomIngredients];
    return { result: allMatchingIngredients, resultType: 'query' };
  }
  return { result, resultType: 'group' };
};

/**
 * Update an existing ingredient in the database.
 *
 * @param {string} ingredientId - The ID of the ingredient to update.
 * @param {object} updateData - The data to update the ingredient with.
 * @returns {object} - The updated ingredient object.
 * @throws {ApiError} - Throws error if the ingredient does not exist.
 */
const updateIngredient = async (ingredientId, updateData) => {
  // Find the ingredient by ID to ensure it exists
  const existingIngredient = await Ingredient.findById(ingredientId);

  // If the ingredient does not exist, throw an error
  if (!existingIngredient) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Ingredient not found');
  }

  // Update the ingredient with the new data
  Object.assign(existingIngredient, updateData);

  // Save the updated ingredient back to the database
  return existingIngredient.save();
};

const getIngredientsByCategories = async () => {
  const categoryOrder = ['carbs', 'proteins', 'fats', 'fruits', 'dairy', 'snacks'];
  const ingredientsByCategory = await Ingredient.aggregate([
    {
      $group: {
        _id: '$category',
        items: {
          $push: {
            id: '$_id',
            name: '$name',
            icon: '$icon',
            serving: '$serving',
          },
        },
      },
    },
    {
      $addFields: {
        sortOrder: {
          $indexOfArray: [categoryOrder, '$_id'],
        },
      },
    },
    {
      $match: {
        sortOrder: { $gte: 0 }, // Only include categories found in the categoryOrder array
      },
    },
    {
      $sort: { sortOrder: 1 }, // Sort by custom sortOrder field
    },
    {
      $project: {
        _id: 0,
        category: '$_id', // Rename _id to category
        items: 1, // Keep items
      },
    },
  ]);
  return ingredientsByCategory;
};

const deleteIngredient = async (ingredientId) => {
  const ingredient = await Ingredient.findById(ingredientId);

  if (!ingredient) throw new ApiError(httpStatus.NOT_FOUND, 'Ingredient not found');

  await ingredient.remove();
  return ingredient;
};

module.exports = {
  createIngredient,
  getIngredient,
  queryIngredients,
  updateIngredient,
  getIngredientsForUser,
  getIngredientsByCategories,
  deleteIngredient,
};
