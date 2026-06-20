import { ResponseError } from "@/app/lib/classes/ResponseError";
import { assertSameOrigin } from "@/app/lib/auth/origin";
import { AuthenticatedUser, getSessionUser } from "@/app/lib/auth/session";

/**
 * Authenticates the current request from the httpOnly `__session` cookie.
 */
export const requireUser = async (): Promise<AuthenticatedUser> => {
  await assertSameOrigin();

  const session = await getSessionUser();

  if (!session) {
    throw new ResponseError("User is not authenticated.", 401);
  }

  return session;
};
