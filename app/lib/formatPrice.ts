/**
 * Format price
 * @param number Price to format
 */
export const moneyFormatter = (number: number | undefined) => {
  if (!number) return '';
  let moneyFormatter = new Intl.NumberFormat();
  return moneyFormatter.format(number);
}
