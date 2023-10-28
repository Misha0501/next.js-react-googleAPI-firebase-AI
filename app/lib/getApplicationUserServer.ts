// @ts-ignore
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import { getDecodedIdToken } from "@/app/lib/getDecodedIdToken";
import { prisma } from "@/app/lib/db/client";
import { ApplicationUser } from "@/types";

/**
 * Fetches an application user from the server.
 *
 * @param {boolean} [includeCompanyMembership=false] - Whether to include company membership in the fetched data.
 * @returns {Promise<ApplicationUser>} - The application user.
 * @throws Will throw an error if fetching the application user fails.
 */
export const getApplicationUserServer = async (
  includeCompanyMembership: boolean = false,
): Promise<ApplicationUser> => {
  const decodedToken: DecodedIdToken = await getDecodedIdToken();

  let prismaQuery = {
    where: { email: decodedToken.email },
    include: {
      Membership: false,
    },
  };

  if (includeCompanyMembership) {
    prismaQuery.include.Membership = true;
  }

  return await prisma.applicationUser.findUnique({
    ...prismaQuery,
  });
};
