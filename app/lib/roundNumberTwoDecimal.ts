/**
 * Rounds a number to two decimal places.
 *
 * @param {number} number - The number to round.
 * @returns {number} - The rounded number.
 */
export const roundNumberTwoDecimal = (number: number) => {
  return +(Math.round(Number(number + "e+2")) + "e-2");
};
