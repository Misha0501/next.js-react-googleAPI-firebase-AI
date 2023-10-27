import { prisma } from "@/app/lib/db/client";
import { ResponseError } from "@/app/lib/classes/ResponseError";

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
