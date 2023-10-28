import { NextResponse } from "next/server";
import { getApplicationUserServer } from "@/app/lib/getApplicationUserServer";
import { getDecodedIdToken } from "@/app/lib/getDecodedIdToken";
import { prisma } from "@/app/lib/db/client";
import { ApplicationUser } from "@/types";
import { userPUTSchema } from "@/app/lib/validations/user";
import { firebaseAdmin } from "@/app/lib/firebase/configAdmin";
import { findApplicationUserByEmail, handleUserAPIUpdateError } from "@/app/api/users/_utils";
import { handleAPIError } from "@/app/lib/api/handleError";

/**
 * GET Route to retrieve users data
 * @param req
 * @constructor
 */
export async function GET(req: Request) {
  try {
    const decodedToken = await getDecodedIdToken();

    const applicationUser = await findApplicationUserByEmail(
      decodedToken.email,
    );

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
    const applicationUser: ApplicationUser =
      await getApplicationUserServer(true);

    const parsedValues = userPUTSchema.parse(await req.json());
    const { displayName, phoneNumber, newPassword } = parsedValues;

    await firebaseAdmin.auth().updateUser(applicationUser.firebaseUID, {
      displayName,
      phoneNumber,
      ...(newPassword && { password: newPassword }),
    });

    const updatedApplicationUser = await prisma.applicationUser.update({
      where: { id: applicationUser.id },
      data: {
        displayName,
        phoneNumber,
      },
    });

    return NextResponse.json(updatedApplicationUser);
  } catch (error) {
    return handleUserAPIUpdateError(error);
  }
}
