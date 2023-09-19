export const getFetchUrl = (route: string) => {
    // Temporary fix for Vercel deployment issue TODO: remove this when fixed
    // return "http://localhost:3000/" + route;

    return `${
      process.env.NODE_ENV === "production"
        ? `https://${process.env.VERCEL_URL}` || "http://localhost:3000" 
        : "http://localhost:3000"
    }/${route}`;
};