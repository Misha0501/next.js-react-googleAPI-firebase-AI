/**
 * Get API fetch url
 * @param route Route to get the fetch url for
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
