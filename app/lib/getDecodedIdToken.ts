import { firebaseAdminAuth } from "@/app/lib/firebase/configAdmin";
import { cookies, headers } from "next/headers";
import { ResponseError } from "@/app/lib/classes/ResponseError";

/**
 * Decodes the ID token for a user. The token can be obtained from either the request headers
 * or from cookies. If the token is found, it is verified using Firebase Admin SDK to ensure its validity.
 *
 * @returns {Promise<DecodedIdToken>} Returns a Promise that resolves with the decoded ID token.
 *
 * @throws {ResponseError} Throws an error if the user is not authenticated.
 *
 * @example
 * try {
 *     const decodedToken = await getDecodedIdToken();
 *     console.log(decodedToken);
 * } catch (error) {
 *     console.error("Failed to decode token:", error.message);
 * }
 */

export const getDecodedIdToken = async () => {
  const [headersList, cookieStore] = await Promise.all([headers(), cookies()]);
  const headerAuthorizationToken = headersList.get("Authorization");

  const cookiesAuthorizationToken =
    cookieStore.get("Authorization")?.value || "";
  const cookiesAuthToken = cookieStore.get("authToken")?.value || "";
  const cookieToken = cookiesAuthorizationToken || cookiesAuthToken;

  if (!headerAuthorizationToken && !cookieToken) {
    throw new ResponseError("User is not authenticated.", 401);
  }

  return firebaseAdminAuth.verifyIdToken(
    headerAuthorizationToken || cookieToken || "",
  );
};
