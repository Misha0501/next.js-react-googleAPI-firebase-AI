/**
 * Checks if the date string can be a valid date.
 * Format should be 2023-12-31
 * @param dateString
 */
export const isValidDateFromString = (dateString) => {
    // if(!(/\d{4}-\d{2}-\d{2}/.test(dateString))) return false;
    return !isNaN(new Date(dateString));
}