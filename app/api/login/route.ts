import {NextResponse} from 'next/server'
import {loginSchema} from "@/app/lib/validations/auth";
import {z} from "zod";
import axios, {AxiosError} from "axios";
import {FirebaseAPISignInAuthResponse} from "@/types";
import { cookies } from 'next/headers'

/**
 * POST Route to login
 * @param req
 * @constructor
 */
export async function POST(req: Request) {
    try {
        const parsedValues = loginSchema.parse(await req.json());

        const {email, password} = parsedValues;

        // Making API call to Google identitytoolkit to check the credentials
        const response = await axios.post<FirebaseAPISignInAuthResponse>(`${process.env.IDENTITYTOOLKIT_GOOGLE_API_BASE_URL}/v1/accounts:signInWithPassword?key=${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`, {
            email,
            password,
            returnSecureToken: true
        })

        const authToken = response.data.idToken;
        const refreshToken = response.data.refreshToken;

        const oneDay = 24 * 60 * 60 * 1000

        cookies().set('authToken', authToken, { expires: Date.now() - oneDay });
        cookies().set('refreshToken', refreshToken, { expires: Date.now() - oneDay });

        return NextResponse.json({email: response.data.email, authToken, refreshToken})
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new Response(error.message, {status: 422})
        }

        if (error instanceof AxiosError && error.response && error.response.status === 400) {
            // The request was made and the server responded with a status code 400
            return new Response("Username or password is incorrect.", {status: 400})
        }

        return new Response('Something went wrong please try again later', {
            status: 500,
        })
    }
}
