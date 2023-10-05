/**
 * Generate a unique id
 */
export const uniqueID = () => {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}
