import {NextResponse} from 'next/server'
import {z} from "zod"
import {getApplicationUserServer} from "@/app/lib/getApplicationUserServer";
import {ResponseError} from "@/classes/ResponseError";
import {getDecodedIdToken} from "@/app/lib/getDecodedIdToken";
import {prisma} from "@/app/lib/db/client";

/**
 * POST Route to register new users. it's only invoked be Google functions
 * @param req
 * @constructor
 */
export async function GET(req: Request) {
    try {

        const decodedToken = await getDecodedIdToken()

        const applicationUser =  await prisma.applicationUser.findUnique({
            where: {email: decodedToken.email},
            include: {
                Membership: true,
                Invoice: true,
                Listing: {
                    include: {
                        ListingImage: true,
                        Address: true,
                        ListingPrice: true,
                    },
                    where: {
                        deleted: null,
                    }
                },
                SavedListing: true,
                SavedSearch: true,
            },
        });

        return NextResponse.json(applicationUser)
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new Response(error.message, {status: 422})
        }

        if(error instanceof ResponseError) {
            return new Response(error.message, {status: error.status})
        }

        if(error.errorInfo && error.errorInfo.code) {
            return new Response('Your auth token is invalid or it has expired. Get a new auth token and try again.', {status: 400})
        }

        return new Response('Something went wrong please try again later', {
            status: 500,
        })
    }
}
