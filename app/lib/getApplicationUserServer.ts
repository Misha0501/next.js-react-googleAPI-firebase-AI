import {DecodedIdToken} from "firebase-admin/lib/auth/token-verifier";
import {getDecodedIdToken} from "@/app/lib/getDecodedIdToken";
import {ApplicationUser} from '@prisma/client'
import {prisma} from "@/app/lib/db/client";

export const getApplicationUserServer = async (): Promise<ApplicationUser> => {
    try {

        const decodedToken: DecodedIdToken = await getDecodedIdToken()

        return await prisma.applicationUser.findUnique({
            where: {
                email: decodedToken.email,
            },
        })

    } catch (e) {
        throw e;
    }
}
