export const roundToDecimal = (num: number, decimals = 1) => Math.round(num * 10 ** decimals) / 10 ** decimals;
