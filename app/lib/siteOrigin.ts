const DEFAULT_LOCAL_ORIGIN = "http://localhost:3000";
const DEFAULT_PRODUCTION_ORIGIN = "https://homfli.com";

export const normalizeOrigin = (origin: string): string => {
  const value = origin.trim().replace(/\/$/, "");

  if (value.startsWith("http://") || value.startsWith("https://")) {
    try {
      return new URL(value).origin;
    } catch {
      // Fall through to protocol detection for malformed values.
    }
  }

  const isLocal =
    value.startsWith("localhost") ||
    value.startsWith("127.0.0.1") ||
    value.startsWith("[::1]");

  return `${isLocal ? "http" : "https"}://${value}`;
};

export const getSiteOrigin = (): string => {
  const configuredOrigin =
    process.env.SITE_URL ?? process.env.VERCEL_PROJECT_PRODUCTION_URL;

  if (configuredOrigin) {
    return normalizeOrigin(configuredOrigin);
  }

  return process.env.NODE_ENV === "production"
    ? DEFAULT_PRODUCTION_ORIGIN
    : DEFAULT_LOCAL_ORIGIN;
};

export const getDeploymentOrigin = (): string => {
  const configuredOrigin =
    process.env.VERCEL_URL ??
    process.env.SITE_URL ??
    process.env.VERCEL_PROJECT_PRODUCTION_URL;

  if (configuredOrigin) {
    return normalizeOrigin(configuredOrigin);
  }

  return process.env.NODE_ENV === "production"
    ? DEFAULT_PRODUCTION_ORIGIN
    : DEFAULT_LOCAL_ORIGIN;
};
