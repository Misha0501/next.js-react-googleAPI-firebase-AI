import {DecodedIdToken} from "firebase-admin/lib/auth/token-verifier";
import {getDecodedIdToken} from "@/app/lib/getDecodedIdToken";
import {ApplicationUser} from '@prisma/client'
import {prisma} from "@/app/lib/db/client";

/**
 * Get the application user from the server
 * @param includeCompanyMembership Whether to include the company membership
 */
export const getApplicationUserServer = async (includeCompanyMembership: boolean = false): Promise<ApplicationUser> => {
    try {

        const decodedToken: DecodedIdToken = await getDecodedIdToken()

        let prismaQuery = {
            where: {email: decodedToken.email},
            include: {},
        }

        if (includeCompanyMembership) {
            prismaQuery.include.Membership = true;
        }

        return await prisma.applicationUser.findUnique({
            ...prismaQuery
        });

    } catch (e) {
        throw e;
    }
}
