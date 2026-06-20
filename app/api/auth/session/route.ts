import { NextResponse } from "next/server";
import { getFirebaseAdminAuth } from "@/app/lib/firebase/configAdmin";
import { prisma } from "@/app/lib/db/client";
import { handleAPIError } from "@/app/lib/api/handleError";
import { ResponseError } from "@/app/lib/classes/ResponseError";
import { checkRateLimit } from "@/app/lib/redis/rateLimit";
import { assertSameOrigin } from "@/app/lib/auth/origin";
import {
  SESSION_COOKIE_NAME,
  SESSION_DURATION_MS,
  sessionCookieOptions,
  toCurrentUserDto,
} from "@/app/lib/auth/session";

/**
 * Exchanges a short-lived Firebase ID token for an httpOnly session cookie.
 * This is the ONLY endpoint allowed to accept a Firebase ID token from the browser.
 */
export async function POST(req: Request) {
  try {
    await assertSameOrigin();

    const ip = req.headers.get("x-forwarded-for") ?? "unknown";
    if (!(await checkRateLimit(`rate:auth-session:${ip}`, 10, 60))) {
      return new Response("Too many requests", { status: 429 });
    }

    const { idToken } = await req.json();

    if (!idToken || typeof idToken !== "string") {
      throw new ResponseError("idToken is required.", 400);
    }

    const decoded = await getFirebaseAdminAuth().verifyIdToken(idToken, true);

    if (!decoded.email) {
      throw new ResponseError(
        "Authenticated user does not have an email address.",
        400,
      );
    }

    // Identity fields come only from the verified token, never from the request body.
    const membershipInclude = {
      Membership: { include: { company: true } },
    } as const;

    let applicationUser = await prisma.applicationUser.findUnique({
      where: { email: decoded.email },
      include: membershipInclude,
    });

    if (!applicationUser) {
      applicationUser = await prisma.applicationUser.create({
        data: {
          email: decoded.email,
          displayName: decoded.name || "",
          providerId: decoded.firebase?.sign_in_provider || "firebase",
          firebaseUID: decoded.uid,
        },
        include: membershipInclude,
      });
    } else if (!applicationUser.displayName && decoded.name) {
      // Backfill a missing display name; never overwrite one the user has set.
      applicationUser = await prisma.applicationUser.update({
        where: { id: applicationUser.id },
        data: { displayName: decoded.name },
        include: membershipInclude,
      });
    }

    const sessionCookie = await getFirebaseAdminAuth().createSessionCookie(
      idToken,
      { expiresIn: SESSION_DURATION_MS },
    );

    const response = NextResponse.json({
      user: toCurrentUserDto(applicationUser),
    });

    response.cookies.set(
      SESSION_COOKIE_NAME,
      sessionCookie,
      sessionCookieOptions(SESSION_DURATION_MS),
    );

    return response;
  } catch (error) {
    return handleAPIError(error);
  }
}
