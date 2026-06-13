const normalizeRoute = (route: string): string => {
  return route.startsWith("/") ? route : `/${route}`;
};

const normalizeBaseUrl = (baseUrl: string): string => {
  const value = baseUrl.trim().replace(/\/$/, "");

  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }

  const isLocal =
    value.startsWith("localhost") ||
    value.startsWith("127.0.0.1") ||
    value.startsWith("[::1]");

  return `${isLocal ? "http" : "https"}://${value}`;
};

const getServerBaseUrl = (): string => {
  const configuredUrl =
    process.env.API_URL ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.NEXT_PUBLIC_API_URL ??
    process.env.VERCEL_URL ??
    process.env.NEXT_PUBLIC_VERCEL_URL;

  return normalizeBaseUrl(configuredUrl ?? "localhost:3000");
};

export const getFetchUrl = (route: string): string => {
  const normalizedRoute = normalizeRoute(route);

  if (typeof window === "undefined") {
    return `${getServerBaseUrl()}${normalizedRoute}`;
  }

  return `${window.location.origin}${normalizedRoute}`;
};
