export const getFetchUrl = (route: string) => {
    return `${
      process.env.NODE_ENV === "production"
        ? `https://${process.env.NEXT_PUBLIC_API_URL || process.env.VERCEL_URL || process.env.NEXT_PUBLIC_VERCEL_URL || 'http://localhost:3000'}` 
        : "http://localhost:3000"
    }${route}`;
};