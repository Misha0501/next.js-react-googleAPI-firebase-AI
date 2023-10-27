import { NextRequest, NextResponse } from "next/server";
import { ApplicationUser } from "@prisma/client";
import { getApplicationUserServer } from "@/app/lib/getApplicationUserServer";
import { prisma } from "@/app/lib/db/client";
import { companyMembershipInviteSchema } from "@/app/lib/validations/companyMembershipInvite";
import { handleAPIError } from "@/app/lib/api/handleError";
import {
  getActiveMembership,
  getCompanyMembershipInvitesByStatus,
  getUserByEmail, hasUserSentInvite, isUserAMemberOfAnyCompany
} from "@/app/api/companyMembershipInvites/_utils";

/**
 * GET invites of the user
 * @param req
 * @constructor
 */
export async function GET(req: NextRequest) {
  try {
    const applicationUser: ApplicationUser =
      await getApplicationUserServer(true);

    const membership = await getActiveMembership(applicationUser.id);

    const invites = await getCompanyMembershipInvitesByStatus(applicationUser, !membership);

    return NextResponse.json(invites);
  } catch (error) {
    return handleAPIError(error);
  }
}

/**
 * POST Route to create a company membership invite.
 * @param req
 * @constructor
 */
export async function POST(req: Request) {
  try {
    const applicationUser: ApplicationUser =
      await getApplicationUserServer(true);

    const parsedValues = companyMembershipInviteSchema.parse(await req.json());
    const { applicationUserRole, applicationUserEmailReceiver } = parsedValues;

    const membership = await getActiveMembership(applicationUser.id);

    if (!membership) {
      return new Response("You are not a member of a company", { status: 400 });
    }

    const applicationUserReceiver = await getUserByEmail(applicationUserEmailReceiver);

    if (!applicationUserReceiver) {
      return new Response("The user you want to invite does not exist", { status: 400 });
    }

    if (await isUserAMemberOfAnyCompany(applicationUserReceiver.id)) {
      return new Response("The user is already a member of a company", { status: 400 });
    }

    if (await hasUserSentInvite(applicationUser.id, applicationUserEmailReceiver, membership.companyId)) {
      return new Response("You have already sent an invite to this user", { status: 400 });
    }

    const sevenDaysFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    // add the invite to the database
    const companyMembershipInvite = await prisma.companyMembershipInvite.create(
      {
        data: {
          applicationUserSender: {
            connect: {
              id: applicationUser.id,
            },
          },
          applicationUserReceiver: {
            connect: {
              id: applicationUserReceiver.id,
            },
          },
          company: {
            connect: {
              id: membership.companyId,
            },
          },
          applicationUserRole,
          expiresAt: sevenDaysFromNow,
        },
      },
    );

    return NextResponse.json(companyMembershipInvite);
  } catch (error) {
    return handleAPIError(error);
  }
}
