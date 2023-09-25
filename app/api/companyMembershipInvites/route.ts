import { NextRequest, NextResponse } from "next/server";
import { ApplicationUser } from "@prisma/client";
import { z } from "zod";
import { ResponseError } from "@/classes/ResponseError";
import { getApplicationUserServer } from "@/app/lib/getApplicationUserServer";
import { prisma } from "@/app/lib/db/client";
import { companyMembershipInviteSchema } from "@/app/lib/validations/companyMembershipInvite";

/**
 * GET invites of the user
 * @param req
 * @constructor
 */
export async function GET(req: NextRequest) {
  try {
    const applicationUser: ApplicationUser =
      await getApplicationUserServer(true);

    // check if the user has a membership in a company and it's active
    const membership = await prisma.membership.findUnique({
      where: {
        applicationUserId: applicationUser.id,
        isActive: true,
      },
    });

    let invites = [];
    // const companyId = membership?.companyId;

    if( !membership ) {
      // Get users received invites
      invites = await prisma.companyMembershipInvite.findMany({
        where: {
          applicationUserEmailReceiver: applicationUser.email,
        },
        include: {
          company: true,
          applicationUserSender: true,
        },
      });
    } else {
      // Get users sent invites
      invites = await prisma.companyMembershipInvite.findMany({
        where: {
          applicationUserIdSender: applicationUser.id,
        },
        include: {
          company: true,
          applicationUserReceiver: true,
        },
      });
    }

    return NextResponse.json(invites);
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }

    if (error instanceof ResponseError) {
      return new Response(error.message, { status: error.status });
    }

    if (error.errorInfo && error.errorInfo.code) {
      return new Response(
        "Your auth token is invalid or it has expired. Get a new auth token and try again.",
        { status: 400 },
      );
    }

    return new Response("Something went wrong please try again later", {
      status: 500,
    });
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
    let { applicationUserRole, applicationUserEmailReceiver } = parsedValues;

    // check if the user has a membership in a company and it's active
    const membership = await prisma.membership.findUnique({
      where: {
        applicationUserId: applicationUser.id,
        isActive: true,
      },
    });

    // get companyId
    const companyId = membership?.companyId;

    if (!membership || !companyId) {
      return new Response("You are not a member of a company", {
        status: 400,
      });
    }

    // check if the receiver exists
    const applicationUserReceiver = await prisma.applicationUser.findUnique({
      where: {
        email: applicationUserEmailReceiver,
      },
    });

    const applicationUserReceiverId = applicationUserReceiver?.id;

    // if not throw an error
    if (!applicationUserReceiver) {
      return new Response("The user you want to invite does not exist", {
        status: 400,
      });
    }

    // check if the other user is already a member of any company
    const receiverMembership = await prisma.membership.findUnique({
      where: {
        applicationUserId: applicationUserReceiverId,
        isActive: true,
      },
    });

    if (receiverMembership) {
      return new Response("The user is already a member of a company", {
        status: 400,
      });
    }

    // check if the user has already sent an invite to the other user

    const companyMembershipInviteExists =
      await prisma.companyMembershipInvite.findFirst({
        where: {
          applicationUserIdSender: applicationUser.id,
          applicationUserEmailReceiver: applicationUserEmailReceiver,
          companyId: companyId,
        },
      });

    if (companyMembershipInviteExists) {
      return new Response("You have already sent an invite to this user", {
        status: 400,
      });
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
              id: applicationUserReceiverId,
            },
          },
          company: {
            connect: {
              id: companyId,
            },
          },
          applicationUserRole,
          expiresAt: sevenDaysFromNow,
        },
      },
    );

    return NextResponse.json(companyMembershipInvite);
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }

    if (error instanceof ResponseError) {
      return new Response(error.message, { status: error.status });
    }

    if (error.errorInfo && error.errorInfo.code) {
      return new Response(
        "Your auth token is invalid or it has expired. Get a new auth token and try again.",
        { status: 400 },
      );
    }

    return new Response("Something went wrong please try again later", {
      status: 500,
    });
  }
}
