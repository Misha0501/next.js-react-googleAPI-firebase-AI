/**
 * Formats a number as a currency string.
 *
 * @param {number | undefined} number - The number to format.
 * @returns {string} - The formatted currency string.
 */
export const moneyFormatter = (number: number | undefined) => {
  if (!number) return '';
  let moneyFormatter = new Intl.NumberFormat();
  return moneyFormatter.format(number);
}
