import {NextRequest, NextResponse} from 'next/server'
import {ApplicationUser} from '@prisma/client'
import {z} from "zod"
import {ResponseError} from "@/classes/ResponseError";
import {getApplicationUserServer} from "@/app/lib/getApplicationUserServer";
import {prisma} from "@/app/lib/db/client";
import {savedListingsSchema} from "@/app/lib/validations/savedListings";

/**
 * GET saved listings of the user
 * @param req
 * @constructor
 */
export async function GET(req: NextRequest) {
    try {
        const applicationUser: ApplicationUser = await getApplicationUserServer(true);

        let savedListings = await prisma.savedListing.findMany({
            where: {
                applicationUserId: applicationUser.id,
            },
        })

        return NextResponse.json([...savedListings])
    } catch (error) {
        console.error(error)
        if (error instanceof z.ZodError) {
            return new Response(error.message, {status: 422})
        }

        if (error instanceof ResponseError) {
            return new Response(error.message, {status: error.status})
        }

        if (error.errorInfo && error.errorInfo.code) {
            return new Response('Your auth token is invalid or it has expired. Get a new auth token and try again.', {status: 400})
        }

        return new Response('Something went wrong please try again later', {
            status: 500,
        })
    }
}

/**
 * POST Route to create new saved listing for a user.
 * @param req
 * @constructor
 */
export async function POST(req: Request) {
    try {
        const applicationUser: ApplicationUser = await getApplicationUserServer(true);

        const parsedValues = savedListingsSchema.parse(await req.json());
        const {
            listingId
        } = parsedValues

        // Create user if not exists in the DB
        const savedListingData = {
            applicationUserId: applicationUser.id,
            listingId
        }

        let savedListing = await prisma.savedListing.findMany({where: {...savedListingData},})

        if (!savedListing || !savedListing.length) {
            savedListing = await prisma.savedListing.create({data: {...savedListingData}})
        }

        return NextResponse.json(savedListing)
    } catch (error) {
        console.error(error)
        if (error instanceof z.ZodError) {
            return new Response(error.message, {status: 422})
        }

        if (error instanceof ResponseError) {
            return new Response(error.message, {status: error.status})
        }

        if (error.errorInfo && error.errorInfo.code) {
            return new Response('Your auth token is invalid or it has expired. Get a new auth token and try again.', {status: 400})
        }

        return new Response('Something went wrong please try again later', {
            status: 500,
        })
    }
}
