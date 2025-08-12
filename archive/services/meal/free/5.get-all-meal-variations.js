/**
 * Generates all possible variations of combining elements from multiple arrays.
 * If one of the arrays is empty, it skips that array but still combines the rest.
 *
 * @param {Array[]} arrays - An array of arrays where each inner array contains items to combine.
 * @returns {Array[]} - A 2D array where each inner array represents a unique combination of items from the input arrays.
 *                      Returns an empty array if all arrays are empty.
 */
const getAllVariations = (arrays) => {
  const nonEmptyArrays = arrays.filter((arr) => arr.length > 0);

  if (nonEmptyArrays.length === 0) {
    return [];
  }

  const allVariations = nonEmptyArrays.reduce(
    (acc, currArray) => {
      const result = [];

      acc.forEach((accItem) => {
        currArray.forEach((currItem) => {
          result.push([...accItem, currItem]);
        });
      });

      return result;
    },
    [[]]
  );

  return allVariations;
};

module.exports = getAllVariations;
