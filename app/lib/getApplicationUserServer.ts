import { getDecodedIdToken } from "@/app/lib/getDecodedIdToken";
import { prisma } from "@/app/lib/db/client";
import { ApplicationUser } from "@/types";
import { ResponseError } from "@/app/lib/classes/ResponseError";

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
  const decodedToken = await getDecodedIdToken();

  if (!decodedToken.email) {
    throw new ResponseError("Authenticated user does not have an email address.", 400);
  }

  let prismaQuery = {
    where: { email: decodedToken.email },
    include: {
      Membership: false,
    },
  };

  if (includeCompanyMembership) {
    prismaQuery.include.Membership = true;
  }

  const applicationUser = await prisma.applicationUser.findUnique({
    ...prismaQuery,
  });

  if (applicationUser) return applicationUser;

  return await prisma.applicationUser.create({
    data: {
      email: decodedToken.email,
      displayName: decodedToken.name || "",
      providerId: decodedToken.firebase?.sign_in_provider || "firebase",
      firebaseUID: decodedToken.uid,
    },
    include: prismaQuery.include,
  });
};
