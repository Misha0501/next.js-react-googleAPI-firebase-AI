import { FirebaseAPISignInAuthResponse } from "@/types";
import { cookies } from "next/headers";
import axios from "axios";

const IDENTITYTOOLKIT_URL = process.env.IDENTITYTOOLKIT_GOOGLE_API_BASE_URL;
const FIREBASE_API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

if (!IDENTITYTOOLKIT_URL || !FIREBASE_API_KEY) {
  throw new Error("Environment variables for Firebase are missing.");
}
const ONE_DAY = 24 * 60 * 60 * 1000;

/**
 * Sets the authentication and refresh tokens as cookies.
 * @param {string} authToken - The authentication token.
 * @param {string} refreshToken - The refresh token.
 */
export const setAuthCookiesForOneDay = (
  authToken: string,
  refreshToken: string,
): void => {
  cookies().set("authToken", authToken, { expires: Date.now() + ONE_DAY });
  cookies().set("refreshToken", refreshToken, {
    expires: Date.now() + ONE_DAY,
  });
};

/**
 * Handles the authentication with Google's Identity Toolkit.
 * @param {string} email - The email to authenticate.
 * @param {string} password - The password to authenticate.
 * @returns {Promise<FirebaseAPISignInAuthResponse>} - Returns the authentication response.
 */
export const authenticateWithFirebaseIdentityToolkit = async (
  email: string,
  password: string,
): Promise<axios.AxiosResponse<FirebaseAPISignInAuthResponse>> => {
  return await axios.post<FirebaseAPISignInAuthResponse>(
    `${IDENTITYTOOLKIT_URL}/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`,
    {
      email,
      password,
      returnSecureToken: true,
    },
  );
};
