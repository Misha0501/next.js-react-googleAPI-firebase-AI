export const getFetchUrl = (route: string) => {
    // Temporary fix for Vercel deployment issue TODO: remove this when fixed
    // return "http://localhost:3000/" + route;

    console.log("process.env.VERCEL_URL", process.env.VERCEL_URL);
    console.log("process.env.API_URL", process.env.API_URL);
    console.log("process.env.NEXT_PUBLIC_VERCEL_URL", process.env.NEXT_PUBLIC_VERCEL_URL);
    console.log("process.env.NODE_ENV", process.env.NODE_ENV);
    console.log("route", route);

    return `${
      process.env.NODE_ENV === "production"
        ? `https://${process.env.API_URL || process.env.VERCEL_URL || process.env.NEXT_PUBLIC_VERCEL_URL }` || "http://localhost:3000" 
        : "http://localhost:3000"
    }${route}`;
};