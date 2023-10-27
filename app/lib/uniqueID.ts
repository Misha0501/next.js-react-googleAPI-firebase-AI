/**
 * Generates a unique ID based on the current date and a random number.
 *
 * @returns {string} - The unique ID.
 */
export const uniqueID = () => {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}
