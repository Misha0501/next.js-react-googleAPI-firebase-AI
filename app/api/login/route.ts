import { NextResponse } from "next/server";
import { loginSchema } from "@/app/lib/validations/auth";
import { z } from "zod";
import { AxiosError } from "axios";
import { authenticateWithFirebaseIdentityToolkit, setAuthCookiesForOneDay } from "@/app/api/login/_utils";

/**
 * POST Route to login
 * @param req
 * @constructor
 */
export async function POST(req: Request) {
  try {
    const parsedValues = loginSchema.parse(await req.json());

    const { email, password } = parsedValues;

    const response = await authenticateWithFirebaseIdentityToolkit(
      email,
      password,
    );

    const authToken = response.data.idToken;
    const refreshToken = response.data.refreshToken;

    setAuthCookiesForOneDay(authToken, refreshToken);

    return NextResponse.json({
      email: response.data.email,
      authToken,
      refreshToken,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }

    if (
      error instanceof AxiosError &&
      error.response &&
      error.response.status === 400
    ) {
      // The request was made and the server responded with a status code 400
      return new Response("Username or password is incorrect.", {
        status: 400,
      });
    }

    return new Response("Something went wrong please try again later", {
      status: 500,
    });
  }
}
