import { FirebaseAPISignInAuthResponse } from "@/types";
import { cookies } from "next/headers";
import { ResponseError } from "@/app/lib/classes/ResponseError";

const IDENTITYTOOLKIT_URL = process.env.IDENTITYTOOLKIT_GOOGLE_API_BASE_URL;
const FIREBASE_API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

if (!IDENTITYTOOLKIT_URL || !FIREBASE_API_KEY) {
  throw new Error("Environment variables for Firebase are missing.");
}
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export const setAuthCookiesForOneDay = async (
  authToken: string,
  refreshToken: string,
): Promise<void> => {
  const cookieStore = await cookies();
  const expiresAt = new Date(Date.now() + ONE_DAY_MS);
  const isProduction = process.env.NODE_ENV === "production";

  cookieStore.set("authToken", authToken, {
    sameSite: "strict",
    secure: isProduction,
    expires: expiresAt,
  });
  // refreshToken is read client-side for token refresh, so httpOnly is intentionally omitted
  cookieStore.set("refreshToken", refreshToken, {
    sameSite: "strict",
    secure: isProduction,
    expires: expiresAt,
  });
};

export const authenticateWithFirebaseIdentityToolkit = async (
  email: string,
  password: string,
): Promise<FirebaseAPISignInAuthResponse> => {
  const response = await fetch(
    `${IDENTITYTOOLKIT_URL}/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, returnSecureToken: true }),
    },
  );

  if (!response.ok) {
    throw new ResponseError(
      "Username or password is incorrect.",
      response.status,
    );
  }

  return response.json() as Promise<FirebaseAPISignInAuthResponse>;
};
