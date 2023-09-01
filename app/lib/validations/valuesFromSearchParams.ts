/**
 * Function used to prepare values from search params for Zod validation
 * @param searchParams
 */
export const valuesFromSearchParams = (searchParams: URLSearchParams) => {
    return Array.from(searchParams.keys()).reduce((values, key) => ({
        ...values, [key]: searchParams.getAll(key)
    }), {} as Record<string, Array<string> | string>)
}
