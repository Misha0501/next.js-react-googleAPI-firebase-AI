/**
 * Checks if the date string can be a valid date.
 * Format should be 2023-12-31
 * @param dateString
 */
export const isValidDateFromString = (dateString: string) => {
    return !isNaN(new Date(dateString));
}
