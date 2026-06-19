import { prisma } from "@/app/lib/db/client";
import { ApplicationUser, CompanyMembershipInvite, Membership } from "@/types";
import { ResponseError } from "@/app/lib/classes/ResponseError";

/**
 * Gets the active membership of a user.
 * @param {number} userId - The ID of the user.
 * @returns {Promise<Membership | null>} - Returns the active membership or null.
 */
export const getActiveMembership = async (
  userId: number,
): Promise<Membership | null> => {
  return await prisma.membership.findFirst({
    where: {
      applicationUserId: userId,
      isActive: true,
    },
  });
};

export const isAdminMembership = (
  membership: Pick<Membership, "applicationUserRole" | "isActive"> | null,
): boolean => {
  return (
    Boolean(membership?.isActive) &&
    membership?.applicationUserRole.toUpperCase() === "ADMIN"
  );
};

export function ensureActiveCompanyAdmin(
  membership: Membership | null,
  companyId?: number,
): asserts membership is Membership {
  if (!membership) {
    throw new ResponseError("You are not a member of a company", 400);
  }

  if (companyId !== undefined && membership.companyId !== companyId) {
    throw new ResponseError("You are not a member of this company", 401);
  }

  if (!isAdminMembership(membership)) {
    throw new ResponseError("Only company admins can perform this action", 403);
  }
}

/**
 * Gets the invites based on membership status.
 * @param {ApplicationUser} user - The user object.
 * @param {boolean} receivedInvites - Flag to determine if we want received invites or sent invites.
 * @returns {Promise<Invite[]>} - Returns the invites.
 */
export const getCompanyMembershipInvitesByStatus = async (
  user: ApplicationUser,
  receivedInvites: boolean,
): Promise<CompanyMembershipInvite[]> => {
  if (receivedInvites) {
    return await prisma.companyMembershipInvite.findMany({
      where: {
        applicationUserEmailReceiver: user.email,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        company: true,
        applicationUserSender: true,
        applicationUserReceiver: true,
      },
    });
  } else {
    return await prisma.companyMembershipInvite.findMany({
      where: {
        applicationUserIdSender: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        company: true,
        applicationUserSender: true,
        applicationUserReceiver: true,
      },
    });
  }
};

/**
 * Gets a user by email.
 * @param {string} email - The email of the user.
 * @returns {Promise<ApplicationUser | null>} - Returns the user or null.
 */
export const getUserByEmail = async (
  email: string,
): Promise<ApplicationUser | null> => {
  return await prisma.applicationUser.findUnique({
    where: {
      email: email,
    },
  });
};

/**
 * Checks if a user is already a member of any company.
 * @param {number} userId - The ID of the user.
 * @returns {Promise<boolean>} - Returns true if the user is a member, otherwise false.
 */
export const isUserAMemberOfAnyCompany = async (
  userId: number,
): Promise<boolean> => {
  const membership = await prisma.membership.findFirst({
    where: {
      applicationUserId: userId,
      isActive: true,
    },
  });
  return !!membership;
};

/**
 * Checks if a user has already sent an invite to another user for a company.
 * @param {number} senderId - The ID of the sender.
 * @param {string} receiverEmail - The email of the receiver.
 * @param {number} companyId - The ID of the company.
 * @returns {Promise<boolean>} - Returns true if an invite exists, otherwise false.
 */
export const hasUserSentInvite = async (
  senderId: number,
  receiverEmail: string,
  companyId: number,
): Promise<boolean> => {
  const invite = await prisma.companyMembershipInvite.findFirst({
    where: {
      applicationUserIdSender: senderId,
      applicationUserEmailReceiver: receiverEmail,
      companyId: companyId,
      accepted: null,
      declined: null,
      expiresAt: {
        gt: new Date(),
      },
    },
  });
  return !!invite;
};

/**
 * Check if the user already has a membership.
 * @param {number} userId - The ID of the user.
 * @returns {Promise<boolean>} - Returns true if the user has a membership, otherwise false.
 */
export const userHasMembership = async (userId: number): Promise<boolean> => {
  const membership = await getActiveMembership(userId);
  return !!membership;
};

/**
 * Gets a company membership invite by ID.
 * @param {number} inviteId - The ID of the invite.
 * @returns {Promise<CompanyMembershipInvite | null>} - Returns the invite or null.
 */
export const getActiveCompanyMembershipInviteById = async (
  inviteId: number,
): Promise<CompanyMembershipInvite | null> => {
  return await prisma.companyMembershipInvite.findFirst({
    where: {
      id: inviteId,
      accepted: null,
      declined: null,
      expiresAt: {
        gt: new Date(),
      },
    },
  });
};

/**
 * Checks if the user is the receiver of the invite.
 * @param {CompanyMembershipInvite} invite - The invite object.
 * @param {ApplicationUser} user - The user object.
 * @returns {boolean} - Returns true if the user is the receiver, otherwise false.
 */
export const isUserReceiverOfInvite = (
  invite: CompanyMembershipInvite,
  user: ApplicationUser,
): boolean => {
  return invite.applicationUserEmailReceiver === user?.email;
};
