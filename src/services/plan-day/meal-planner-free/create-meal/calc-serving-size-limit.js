/**
 * Rounds a number to the nearest multiple of a specified breakpoint.
 * @param {number} value - The number to round.
 * @param {number} breakpoint - The multiple to which the number should be rounded.
 * @returns {number} - The rounded number.
 */
const getBestServingSize = (value, breakpoint) => {
  // Divide the value by the breakpoint
  const quotient = value / breakpoint;

  // Round the quotient to the nearest integer
  const roundedQuotient = Math.round(quotient);

  // if the serving size is 0 return smallest possible size which is the breakpoint value
  if (roundedQuotient === 0) return breakpoint;

  // Multiply by the breakpoint to get the final rounded value
  return roundedQuotient * breakpoint;
};

/**
 * Calculates the smallest and largest portion sizes based on macro limits,
 * macro amount per serving, and a breakpoint for portion sizes.
 * @param {Object} macroLimits - Object containing 'min' and 'max' limits.
 * @param {number} macroPerServing - Amount of macro per serving.
 * @param {number} breakpoint - The portion size increment.
 * @returns {Object} - Object with 'smallestPortion' and 'largestPortion'.
 */
const calcServingSizeLimit = (macroLimits, macroPerServing, breakpoint) => {
  const { min: minLimit, max: maxLimit } = macroLimits;

  // Calculate the smallest and largest portions rounded to the nearest breakpoint
  const smallestPortion = getBestServingSize(minLimit / macroPerServing, breakpoint);
  const largestPortion = getBestServingSize(maxLimit / macroPerServing, breakpoint);

  return { smallestPortion, largestPortion };
};

module.exports = { calcServingSizeLimit, getBestServingSize };
