const monthNames: string[] = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/**
 * Function used to format date to day and month with name
 * @param isoDate Date to format
 */
export const formatToDayAndMonthWithName = (isoDate: string): string => {
  const date = new Date(isoDate);

  const day: number = date.getDate();
  const month: string = monthNames[date.getMonth()];

  return `${day} ${month}`;
};
