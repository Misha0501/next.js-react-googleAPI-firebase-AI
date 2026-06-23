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
  isRecentlyAuthenticated,
  sessionCookieOptions,
  toCurrentUserDto,
} from "@/app/lib/auth/session";

/**
 * Exchanges a short-lived Firebase ID token for an httpOnly session cookie.
 * This is the ONLY endpoint allowed to accept a Firebase ID token from the browser.
 */
export async function POST(req: Request) {
  try {
    await assertSameOrigin(req);

    const ip = req.headers.get("x-forwarded-for") ?? "unknown";
    if (!(await checkRateLimit(`rate:auth-session:${ip}`, 10, 60))) {
      return new Response("Too many requests", { status: 429 });
    }

    const { idToken } = await req.json();

    if (!idToken || typeof idToken !== "string") {
      throw new ResponseError("idToken is required.", 400);
    }

    const decoded = await getFirebaseAdminAuth().verifyIdToken(idToken, true);

    if (!isRecentlyAuthenticated(decoded)) {
      throw new ResponseError(
        "Please sign in again to start a new session.",
        401,
      );
    }

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
    } else {
      if (
        applicationUser.firebaseUID &&
        applicationUser.firebaseUID !== decoded.uid
      ) {
        throw new ResponseError(
          "An account with this email already exists. Please use its original sign-in method.",
          409,
        );
      }

      const updateData: {
        displayName?: string;
        firebaseUID?: string;
        providerId?: string;
      } = {};

      // Backfill missing identity fields; never overwrite user-edited profile data.
      if (!applicationUser.firebaseUID) updateData.firebaseUID = decoded.uid;
      if (!applicationUser.providerId) {
        updateData.providerId =
          decoded.firebase?.sign_in_provider || "firebase";
      }
      if (!applicationUser.displayName && decoded.name) {
        updateData.displayName = decoded.name;
      }

      if (Object.keys(updateData).length > 0) {
        applicationUser = await prisma.applicationUser.update({
          where: { id: applicationUser.id },
          data: updateData,
          include: membershipInclude,
        });
      }
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
