import { NextResponse } from "next/server";
import { loginSchema } from "@/app/lib/validations/auth";
import { authenticateWithFirebaseIdentityToolkit, setAuthCookiesForOneDay } from "@/app/api/login/_utils";
import { handleAPIError } from "@/app/lib/api/handleError";
import { checkRateLimit } from "@/app/lib/redis/rateLimit";

/**
 * POST Route to login
 * @param req
 * @constructor
 */
export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") ?? "unknown";
    if (!(await checkRateLimit(`rate:login:${ip}`, 10, 60))) {
      return new Response("Too many requests", { status: 429 });
    }

    const parsedValues = loginSchema.parse(await req.json());

    const { email, password } = parsedValues;

    const response = await authenticateWithFirebaseIdentityToolkit(
      email,
      password,
    );

    const authToken = response.idToken;
    const refreshToken = response.refreshToken;

    await setAuthCookiesForOneDay(authToken, refreshToken);

    return NextResponse.json({
      email: response.email,
      authToken,
      refreshToken,
    });
  } catch (error) {
    return handleAPIError(error);
  }
}
