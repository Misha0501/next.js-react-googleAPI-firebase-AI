import { NextResponse } from "next/server";
import { handleAPIError } from "@/app/lib/api/handleError";
import { assertSameOrigin } from "@/app/lib/auth/origin";
import { SESSION_COOKIE_NAME, sessionCookieOptions } from "@/app/lib/auth/session";

export async function POST() {
  try {
    await assertSameOrigin();

    const response = NextResponse.json({ success: true });
    response.cookies.set(SESSION_COOKIE_NAME, "", sessionCookieOptions(0));
    return response;
  } catch (error) {
    return handleAPIError(error);
  }
}
