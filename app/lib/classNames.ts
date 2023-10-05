/**
 * Helper function to conditionally join classNames together
 * @param classes classNames to join together
 */
export const classNames = (...classes) => {
    return classes.filter(Boolean).join(' ')
}
