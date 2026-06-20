import { NextResponse } from "next/server";
import { handleAPIError } from "@/app/lib/api/handleError";
import { getSessionUser, toCurrentUserDto } from "@/app/lib/auth/session";

/**
 * Returns the currently authenticated user, or { user: null } if there is no
 * valid session. This is a status check, not a protected resource, so it
 * intentionally responds 200 either way rather than 401 when logged out.
 */
export async function GET() {
  try {
    const session = await getSessionUser();

    if (!session) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({ user: toCurrentUserDto(session.user) });
  } catch (error) {
    return handleAPIError(error);
  }
}
