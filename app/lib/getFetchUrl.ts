/**
 * Constructs the full URL for fetching data based on the given route.
 *
 * When called server-side (e.g. during server-side rendering), this function
 * uses environment variables to determine the base URL or falls back to localhost.
 * When called client-side (in the browser), it uses the current website's base URL.
 *
 * @param {string} route - The API route for which the full URL needs to be constructed.
 *
 * @returns {string} The full URL for fetching data.
 *
 * @example
 * const url = getFetchUrl("/api/users");
 * // If called client-side, might return "https://mywebsite.com/api/users"
 * // If called server-side in production, might return "https://api.mywebsite.com/api/users"
 * // If called server-side in development, returns "http://localhost:3000/api/users"
 *
 */
export const getFetchUrl = (route: string) => {
    if (typeof window === 'undefined') {
        // server-side, fallback to the environment variables or localhost
        return `${
          process.env.NODE_ENV === "production"
            ? `https://${process.env.NEXT_PUBLIC_API_URL || process.env.VERCEL_URL || process.env.NEXT_PUBLIC_VERCEL_URL || 'http://localhost:3000'}`
            : "http://localhost:3000"
        }${route}`;
    }

    // client-side, use current website's base URL
    return `${window.location.origin}${route}`;
};
