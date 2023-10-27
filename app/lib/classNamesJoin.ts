/**
 * Joins class names into a single string.
 *
 * @param {...string[]} classes - Class names to join.
 * @returns {string} - The joined class names.
 */
export const classNamesJoin = (...classes: string[]) => {
    return classes.filter(Boolean).join(' ')
}
