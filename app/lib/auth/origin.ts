import { headers } from "next/headers";
import { ResponseError } from "@/app/lib/classes/ResponseError";

/**
 * Rejects requests whose `Origin` header doesn't match this app's host.
 * Cookie-based auth means the browser attaches the session cookie
 * automatically, so cross-origin requests must be blocked explicitly.
 *
 * Skipped outside production (dev/preview hosts vary) and when no `Origin`
 * header is present (same-origin top-level navigations often omit it).
 */
export const assertSameOrigin = async (): Promise<void> => {
  if (process.env.NODE_ENV !== "production") return;

  const headersList = await headers();
  const origin = headersList.get("origin");
  if (!origin) return;

  const host =
    headersList.get("x-forwarded-host") ?? headersList.get("host");
  const expectedOrigin = `https://${host}`;

  if (origin !== expectedOrigin) {
    throw new ResponseError("Cross-origin request blocked.", 403);
  }
};
