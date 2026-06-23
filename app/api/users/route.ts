import { NextResponse } from "next/server";
import { requireUser } from "@/app/lib/auth/requireUser";
import { isRecentlyAuthenticated } from "@/app/lib/auth/session";
import { prisma } from "@/app/lib/db/client";
import { userPUTSchema } from "@/app/lib/validations/user";
import { getFirebaseAdminAuth } from "@/app/lib/firebase/configAdmin";
import {
  findApplicationUserByEmail,
  handleUserAPIUpdateError,
} from "@/app/api/users/_utils";
import { handleAPIError } from "@/app/lib/api/handleError";
import { ResponseError } from "@/app/lib/classes/ResponseError";
import { normalizeContactPhoneNumber } from "@/app/lib/phoneNumber";

/**
 * GET Route to retrieve users data
 * @param req
 * @constructor
 */
export async function GET(req: Request) {
  try {
    const { user } = await requireUser();

    const applicationUser = await findApplicationUserByEmail(user.email);

    return NextResponse.json(applicationUser);
  } catch (error) {
    return handleAPIError(error);
  }
}

/**
 * PUT Route to update users data
 * @param req
 * @constructor
 */
export async function PUT(req: Request) {
  try {
    const { user: applicationUser, firebase } = await requireUser(req);

    const parsedValues = userPUTSchema.parse(await req.json());
    const { displayName, phoneNumber, newPassword } = parsedValues;
    const normalizedPhoneNumber = normalizeContactPhoneNumber(phoneNumber);

    if (newPassword && !isRecentlyAuthenticated(firebase)) {
      throw new ResponseError(
        "Please sign in again to change your password.",
        401,
      );
    }

    await getFirebaseAdminAuth().updateUser(applicationUser.firebaseUID, {
      displayName,
      ...(newPassword && { password: newPassword }),
    });

    if (newPassword) {
      // Changing the password is a security event: sign out every other session.
      await getFirebaseAdminAuth().revokeRefreshTokens(
        applicationUser.firebaseUID,
      );
    }

    const updatedApplicationUser = await prisma.applicationUser.update({
      where: { id: applicationUser.id },
      data: {
        displayName,
        phoneNumber: normalizedPhoneNumber,
      },
    });

    return NextResponse.json(updatedApplicationUser);
  } catch (error) {
    return handleUserAPIUpdateError(error);
  }
}
