/**
 * Helper function to conditionally join classNames together
 * @param classes classNames to join together
 */
export const classNamesJoin = (...classes: string[]) => {
    return classes.filter(Boolean).join(' ')
}
