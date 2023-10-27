import { NextRequest, NextResponse } from "next/server";
import { ApplicationUser } from "@prisma/client";
import { getApplicationUserServer } from "@/app/lib/getApplicationUserServer";
import { prisma } from "@/app/lib/db/client";
import { membershipSchema } from "@/app/lib/validations/membership";
import { handleAPIError } from "@/app/lib/api/handleError";
import {
  getActiveCompanyMembershipInviteById,
  isUserReceiverOfInvite,
  userHasMembership
} from "@/app/api/companyMembershipInvites/_utils";

/**
 * POST request to decline invite
 * @param req
 * @constructor
 */
export async function POST(req: NextRequest) {
  try {
    const applicationUser: ApplicationUser =
      await getApplicationUserServer(true);

    const parsedValues = membershipSchema.parse(await req.json());
    const { companyMembershipInviteId } = parsedValues;

    if (await userHasMembership(applicationUser.id)) {
      return new Response("You are already a member of a company", {
        status: 400,
      });
    }

    const companyMembershipInvite = await getActiveCompanyMembershipInviteById(
      companyMembershipInviteId,
    );

    if (!companyMembershipInvite) {
      return new Response("The invite does not exist", { status: 400 });
    }

    if (!isUserReceiverOfInvite(companyMembershipInvite, applicationUser)) {
      return new Response("You are not the receiver of the invite", {
        status: 400,
      });
    }

    // set the decline field of the invite to the current date
    const updatedMembershipInvite = await prisma.companyMembershipInvite.update(
      {
        where: {
          id: companyMembershipInviteId,
        },
        data: {
          declined: new Date(),
          expiresAt: new Date(),
        },
      },
    );

    return NextResponse.json(updatedMembershipInvite);
  } catch (error) {
    return handleAPIError(error);
  }
}
