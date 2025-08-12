const httpStatus = require('http-status');
const { mealService } = require('..');
const { Combo } = require('../../models');
const ApiError = require('../../utils/ApiError');
const replaceIngredientIds = require('./replace-ingredient-ids');
const generateComboKey = require('./utils/gen-comb-key');

/**
 * Create combo
 * @param {comboBody} - the combo we want to create
 * @returns {Promis<Combo>} - Combo with replaed ingredientIds to ingredients data
 */
const createCombo = async (comboBody) => {
  const comboKey = generateComboKey(comboBody.key);

  const existingCombo = await Combo.findOne({ key: comboKey }).exec();

  if (existingCombo) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Combo already exists');
  }

  comboBody.key = comboKey;

  const combo = await Combo.create(comboBody);

  const comboWithIngredients = await replaceIngredientIds(combo.toObject());

  await mealService.createFreeMealVariations(comboWithIngredients);

  return comboWithIngredients;
};

/**
 * Query combo
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryCombo = async (options) => {
  const combos = await Combo.paginate(null, options);
  return combos;
};

/**
 * Get combo
 * @param {comboId}
 * @returns {Promise<Combo>}
 */
const getCombo = async (comboId) => {
  const combo = await Combo.findById(comboId);

  if (!combo) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Combo not found');
  }

  const comboWithIngredients = await replaceIngredientIds(combo.toObject());

  return comboWithIngredients;
};

/**
 * Update combo
 * @param {comboId} - the combo we want to update
 * @param {updatedBody} - the new combo data to be updated
 * @returns {Promise<Combo>} - the updated combo
 */
const updateCombo = async (comboId, updatedBody) => {
  const combo = await Combo.findById(comboId);

  if (!combo) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Combo not found');
  }

  await mealService.deleteFreeMealsVariations(comboId);

  const comboWithIngredients = await replaceIngredientIds(combo.toObject());

  await mealService.createFreeMealVariations(comboWithIngredients);

  Object.assign(combo, updatedBody);

  const comboKey = generateComboKey(updatedBody.key);

  combo.key = comboKey;

  return await combo.save();
};

/**
 * Delete combo
 * @param {comboId} - the combo we want to delete
 * @returns {Promise<Combo>} - the updated combo
 */
const deleteCombo = async (comboId) => {
  const combo = await Combo.findById(comboId);

  if (!combo) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Combo not found');
  }

  await mealService.deleteFreeMealsVariations(comboId);

  return await combo.remove();
};

const getPossibleCombos = async (mealNumber, mealType, preferredIngredients) => {
  // I want to save the ingredientIds in an array
  const preferredIngIds = Object.values(preferredIngredients).flatMap((group) => group.map((item) => item.id));

  const combos = await Combo.find({ type: mealType, mealNumbers: { $in: [mealNumber] } }).lean();

  const preferredCombos = [];
  const unpreferredCombos = [];

  combos.map((combo) =>
    Object.values(combo.ingredients).flatMap((group) => {
      group.map((item) => {
        if (preferredIngIds.includes(item.ingredient.toHexString())) {
          preferredCombos.push(combo);
        } else {
          unpreferredCombos.push(combo);
        }
      });
    })
  );

  /**
   * at this point I have the combos with ration and ingredint: 'ingredintId'
   * what you think?
   * if I change it I won't be able to use meal
   * if I don't
   * the structure is overcomplex
   * I can change the {ratio: ingredient:'id"} with just carb: ['id1', 'id2']
   * ✅ or I can change it to group: [{necessary details to make meal}]
   * however I will keep it same for now to see how the end result would be
   *
   * what you would do after passing the possible combos?
   * we are going to generate one meal for each combo
   */

  return { preferredCombos, unpreferredCombos };
};

module.exports = {
  createCombo,
  queryCombo,
  getCombo,
  updateCombo,
  deleteCombo,
  getPossibleCombos,
};
