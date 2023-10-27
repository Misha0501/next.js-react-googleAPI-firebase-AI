import { prisma } from "@/app/lib/db/client";
import { ResponseError } from "@/app/lib/classes/ResponseError";

/**
 * Finds the membership associated with the user ID.
 * @param {number} userId - The ID of the user.
 * @returns {Promise<any>} - Returns the membership details.
 */
export const findMembership = async (userId: number): Promise<any> => {
  return await prisma.membership.findUnique({
    where: { applicationUserId: userId },
    include: {
      company: {
        include: { Address: true }
      }
    }
  });
};

/**
 * Validates the membership invite based on its ID and email.
 * @param {number} inviteId - The ID of the invite.
 * @param {string} email - The email associated with the invite.
 * @returns {Promise<any>} - Returns the invite details.
 * @throws {ResponseError} - Throws an error if validation fails.
 */
export const validateMembershipInvite = async (inviteId: number, email: string): Promise<any> => {
  const invite = await prisma.companyMembershipInvite.findUnique({ where: { id: inviteId } });

  if (!invite) {
    throw new ResponseError("The invite does not exist", 400);
  }
  if (invite.applicationUserEmailReceiver !== email) {
    throw new ResponseError("You are not the receiver of the invite", 400);
  }

  return invite;
};
