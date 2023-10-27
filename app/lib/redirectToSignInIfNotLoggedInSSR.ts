import {firebaseAdmin} from "@/app/lib/firebase/configAdmin";
import {redirect} from "next/navigation";
import {cookies} from "next/headers";
import {auth} from "firebase-admin";
import DecodedIdToken = auth.DecodedIdToken;

/**
 * Redirects to the sign-in page if the user is not logged in on the server-side.
 *
 * @returns {Promise<{decodedIdToken: DecodedIdToken, authToken: string}>} - The decoded ID token and the authentication token.
 * @throws Will redirect to `/signin` if not authenticated or in case of an error.
 */
export const redirectToSignInIfNotLoggedInSSR = async () => {
    try {
        const userToken = cookies().get('authToken');
        if (!userToken) redirect('/signin')

        const decodedIdToken: DecodedIdToken = await firebaseAdmin.auth().verifyIdToken(userToken.value);
        // the user is authenticated!
        return {decodedIdToken, authToken: userToken.value};
    } catch (err) {
        // either the `token` cookie didn't exist
        // or token verification failed
        // either way: redirect to the login page
        console.error(err)
        redirect('/signin')
    }
}
