import { NextRequest, NextResponse } from "next/server";
import { ApplicationUser } from "@/types";
import { getApplicationUserServer } from "@/app/lib/getApplicationUserServer";
import { prisma } from "@/app/lib/db/client";
import { membershipSchema } from "@/app/lib/validations/membership";
import { handleAPIError } from "@/app/lib/api/handleError";
import { findMembership, validateMembershipInvite } from "@/app/api/memberships/_utils";

/**
 * GET membership of the user
 * @param req
 * @constructor
 */
export async function GET(req: NextRequest) {
  try {
    const applicationUser: ApplicationUser =
      await getApplicationUserServer(true);

    const membership = await findMembership(applicationUser.id);

    return NextResponse.json(membership);
  } catch (error) {
    return handleAPIError(error);
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

    let { companyMembershipInviteId } = membershipSchema.parse(
      await req.json(),
    );

    // Check existing membership
    const existingMembership = await findMembership(applicationUser.id);
    if (existingMembership) {
      return new Response("You are already a member of a company", {
        status: 400,
      });
    }

    // Validate membership invite
    const invite = await validateMembershipInvite(
      companyMembershipInviteId,
      applicationUser.email,
    );

    // Update membership invite and create new membership
    const updatedMembershipInvite = prisma.companyMembershipInvite.update({
      where: { id: companyMembershipInviteId },
      data: { accepted: new Date(), expiresAt: new Date() },
    });

    const newMembership = prisma.membership.create({
      data: {
        applicationUserId: applicationUser.id,
        applicationUserRole: invite.applicationUserRole,
        companyId: invite.companyId,
      },
    });

    const result = await prisma.$transaction([
      updatedMembershipInvite,
      newMembership,
    ]);
    return NextResponse.json(result[1]);
  } catch (error) {
    return handleAPIError(error);
  }
}
