import { cookies } from "next/headers";
import type { DecodedIdToken } from "firebase-admin/auth";
import { getFirebaseAdminAuth } from "@/app/lib/firebase/configAdmin";
import { prisma } from "@/app/lib/db/client";
import { ApplicationUser } from "@/types";

export const SESSION_COOKIE_NAME = "__session";
export const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

/** How recent `auth_time` on the session must be for sensitive actions. */
export const RECENT_AUTH_WINDOW_MS = 15 * 60 * 1000;

export type CurrentUserDto = Pick<
  ApplicationUser,
  "id" | "email" | "displayName" | "phoneNumber" | "createdAt" | "Membership"
>;

export const toCurrentUserDto = (user: ApplicationUser): CurrentUserDto => ({
  id: user.id,
  email: user.email,
  displayName: user.displayName,
  phoneNumber: user.phoneNumber,
  createdAt: user.createdAt,
  Membership: user.Membership,
});

export type AuthenticatedUser = {
  user: ApplicationUser;
  firebase: DecodedIdToken;
};

export const sessionCookieOptions = (maxAgeMs: number) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: Math.floor(maxAgeMs / 1000),
});

/**
 * Verifies the `__session` cookie and loads the matching Prisma user.
 * Returns null for any missing/invalid/revoked session rather than throwing,
 * since "not logged in" is an expected, common state.
 */
export const getSessionUser = async (): Promise<AuthenticatedUser | null> => {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionCookie) return null;

  let decoded: DecodedIdToken;
  try {
    decoded = await getFirebaseAdminAuth().verifySessionCookie(
      sessionCookie,
      true,
    );
  } catch {
    return null;
  }

  if (!decoded.email) return null;

  const user = await prisma.applicationUser.findUnique({
    where: { email: decoded.email },
    include: { Membership: { include: { company: true } } },
  });

  if (!user) return null;

  return { user, firebase: decoded };
};

/** True if the session's Firebase `auth_time` is within the recent-auth window. */
export const isRecentlyAuthenticated = (firebase: DecodedIdToken): boolean => {
  const authTimeMs = firebase.auth_time * 1000;
  return Date.now() - authTimeMs <= RECENT_AUTH_WINDOW_MS;
};
