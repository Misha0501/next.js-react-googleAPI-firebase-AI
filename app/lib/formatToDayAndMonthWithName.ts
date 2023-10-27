const monthNames: string[] = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/**
 * Formats an ISO date string into a day and month name format.
 *
 * @param {string} isoDate - The ISO date string.
 * @returns {string} - The formatted date string in day and month name format.
 */
export const formatToDayAndMonthWithName = (isoDate: string): string => {
  const date = new Date(isoDate);

  const day: number = date.getDate();
  const month: string = monthNames[date.getMonth()];

  return `${day} ${month}`;
};
