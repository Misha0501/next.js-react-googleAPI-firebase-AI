import {firebaseAdmin} from "@/app/lib/firebase/configAdmin";
import {cookies, headers} from "next/headers";
import {DecodedIdToken} from "firebase-admin/lib/auth/token-verifier";
import {ResponseError} from "@/classes/ResponseError";

/**
 * Get the firebase's decoded id token from the request
 */
export const getDecodedIdToken = async (): Promise<DecodedIdToken> => {
    const headersList = headers()
    const headerAuthorizationToken = headersList.get('Authorization')

    const cookiesAuthTokenObject = cookies().get('Authorization');
    const cookiesAuthToken = cookiesAuthTokenObject ? cookiesAuthTokenObject.value : '';

    if(!headerAuthorizationToken && !cookiesAuthToken) {
        throw new ResponseError("User is not authenticated.", 401)
    }
    
    return firebaseAdmin.auth().verifyIdToken(cookiesAuthToken || headerAuthorizationToken)
}
