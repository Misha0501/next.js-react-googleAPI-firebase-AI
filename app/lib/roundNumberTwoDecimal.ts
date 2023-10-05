/**
 * Round number to two decimal
 * @param number Number to round
 */
export const roundNumberTwoDecimal = (number: number) => {
  return +(Math.round(number + "e+2") + "e-2");
};
