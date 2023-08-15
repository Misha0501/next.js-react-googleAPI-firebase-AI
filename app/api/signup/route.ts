import {NextResponse} from 'next/server'
import {PrismaClient} from '@prisma/client'
const prisma = new PrismaClient();

/**
 * POST Route to register new users. it's only invoked be Google functions
 * @param req
 * @constructor
 */
export async function POST(req: Request) {
    try {
        // Extract the `req properties` from the body of the request
        const {email, displayName, providerId, firebaseUID} = await req.json()

        // Create user if not exists in the DB
        const applicationUser = await prisma.applicationUser.upsert({
            where: {
                email: email,
                firebaseUID: firebaseUID,
            },
            update: {},
            create: {
                displayName: displayName,
                email: email,
                providerId: providerId,
                firebaseUID: firebaseUID,
            },
        })
        return NextResponse.json({applicationUser})
    } catch (e) {
        return new Response('Something went wrong please try again later', {
            status: 500,
        })
    }
}