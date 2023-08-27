import {NextResponse} from 'next/server'
import {z} from "zod"
import {getApplicationUserServer} from "@/app/lib/getApplicationUserServer";
import {ResponseError} from "@/classes/ResponseError";

/**
 * POST Route to register new users. it's only invoked be Google functions
 * @param req
 * @constructor
 */
export async function GET(req: Request) {
    try {
        const user = await getApplicationUserServer();
        return NextResponse.json(user)
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new Response(error.message, {status: 422})
        }

        if(error instanceof ResponseError) {
            return new Response(error.message, {status: error.status})
        }

        if(error.errorInfo && error.errorInfo.code) {
            return new Response('Firebase ID token is invalid or it has expired. Get a fresh ID token and try again.', {status: 400})
        }

        return new Response('Something went wrong please try again later', {
            status: 500,
        })
    }
}
