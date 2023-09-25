import { NextRequest, NextResponse } from "next/server";
import { ApplicationUser } from "@prisma/client";
import { z } from "zod";
import { ResponseError } from "@/classes/ResponseError";
import { getApplicationUserServer } from "@/app/lib/getApplicationUserServer";
import { prisma } from "@/app/lib/db/client";
import { listingsSearchParamSchema } from "@/app/lib/validations/listing";
import { membershipSchema } from "@/app/lib/validations/membership";

/**
 * GET membership of the user
 * @param req
 * @constructor
 */
export async function GET(req: NextRequest) {
  try {
    const applicationUser: ApplicationUser =
      await getApplicationUserServer(true);

    const membership = await prisma.membership.findUnique({
      where: {
        applicationUserId: applicationUser.id,
      },
    });

    return NextResponse.json(membership);
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
 * POST Route to create a new membership with a company.
 * @param req
 * @constructor
 */
export async function POST(req: Request) {
  try {
    const applicationUser: ApplicationUser =
      await getApplicationUserServer(true);

    const values = await req.json();
    const parsedValues = membershipSchema.parse(values);
    let { companyMembershipInviteId } = parsedValues;


    // check if the user already has a membership
    const membership = await prisma.membership.findUnique({
      where: {
        applicationUserId: applicationUser.id,
      },
    });

    if (membership) {
      return new Response("You are already a member of a company", {
        status: 400,
      });
    }

    // check if the user is a applicationUserReceiver of the invite
    const companyMembershipInvite = await prisma.companyMembershipInvite.findUnique(
      {
        where: {
          id: companyMembershipInviteId,
        },
      },
    );

    if (!companyMembershipInvite) {
      return new Response("The invite does not exist", {
        status: 400,
      });
    }

    if (companyMembershipInvite.applicationUserEmailReceiver !== applicationUser?.email) {
      return new Response("You are not the receiver of the invite", {
        status: 400,
      });
    }

    // set the accepted field of the invite to the current date
    const updatedMembershipInvite = prisma.companyMembershipInvite.update({
      where: {
        id: companyMembershipInviteId,
      },
      data: {
        accepted: new Date(),
        expiresAt: new Date(),
      },
    });

    // add the membership
    const newMembership = prisma.membership.create({
      data: {
        applicationUserId: applicationUser.id,
        applicationUserRole: companyMembershipInvite.applicationUserRole,
        companyId: companyMembershipInvite.companyId,
      },
    });
    
    const result = await prisma.$transaction([updatedMembershipInvite, newMembership])
    return NextResponse.json(result[1]);
    
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
