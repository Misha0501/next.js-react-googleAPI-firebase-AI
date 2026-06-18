import { getDeploymentOrigin } from "@/app/lib/siteOrigin";

const normalizeRoute = (route: string): string => {
  return route.startsWith("/") ? route : `/${route}`;
};

export const getFetchUrl = (route: string): string => {
  const normalizedRoute = normalizeRoute(route);

  if (typeof window === "undefined") {
    return `${getDeploymentOrigin()}${normalizedRoute}`;
  }

  return `${window.location.origin}${normalizedRoute}`;
};
