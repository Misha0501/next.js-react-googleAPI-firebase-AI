import { headers } from "next/headers";
import { ResponseError } from "@/app/lib/classes/ResponseError";
import { normalizeOrigin } from "@/app/lib/siteOrigin";

/**
 * Rejects requests whose `Origin` header is not explicitly allowed.
 * Cookie-based auth means the browser attaches the session cookie automatically,
 * so unsafe cross-origin requests must be blocked explicitly.
 */
const UNSAFE_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

const parseAllowedOrigins = (): string[] => {
  const primaryOrigin = process.env.APP_ORIGIN ?? process.env.SITE_URL;
  const origins = [
    primaryOrigin,
    ...(process.env.ADDITIONAL_ALLOWED_ORIGINS?.split(",") ?? []),
  ];

  return Array.from(
    new Set(
      origins
        .filter((origin): origin is string => !!origin?.trim())
        .map(normalizeOrigin),
    ),
  );
};

export const assertSameOrigin = async (req?: Request): Promise<void> => {
  if (process.env.NODE_ENV !== "production") return;

  const allowedOrigins = parseAllowedOrigins();

  if (allowedOrigins.length === 0) {
    throw new ResponseError("Allowed request origin is not configured.", 500);
  }

  const headersList = await headers();
  const origin = headersList.get("origin");
  const isUnsafeMethod = req ? UNSAFE_METHODS.has(req.method) : false;

  if (!origin) {
    if (isUnsafeMethod) {
      throw new ResponseError("Missing Origin header.", 403);
    }

    return;
  }

  if (!allowedOrigins.includes(normalizeOrigin(origin))) {
    throw new ResponseError("Cross-origin request blocked.", 403);
  }
};
