import { prisma } from "@/app/lib/db/client";

/**
 * Check if the user already has a membership.
 * @param {number} userId - The ID of the user.
 * @returns {Promise<boolean>} - Returns true if the user has a membership, otherwise false.
 */
export const userHasMembership = async (userId: number): Promise<boolean> => {
  const membership = await prisma.membership.findUnique({
    where: {
      applicationUserId: userId,
    },
  });
  return !!membership;
};
