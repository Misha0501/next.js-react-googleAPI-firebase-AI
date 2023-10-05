import {NextRequest, NextResponse} from 'next/server'
import {ApplicationUser} from '@prisma/client'
import {z} from "zod"
import {ResponseError} from "@/app/lib/classes/ResponseError";
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

        const savedListingsCount = await prisma.savedListing.count({
            where: {
                applicationUserId: applicationUser.id,
            },
        })

        let savedListings = await prisma.savedListing.findMany({
            include: {
                listing: {
                    include: {
                        ListingImage: true,
                        Address: true,
                        ListingPrice: true
                    }
                }
            },
            where: {
                applicationUserId: applicationUser.id,
            },
        })

        return NextResponse.json({total: savedListingsCount, results: savedListings})
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

        // Create data
        const savedListingData = {
            applicationUserId: applicationUser.id,
            listingId
        }

        let savedListing = await prisma.savedListing.findMany({where: {...savedListingData},})

        if (!savedListing || !savedListing.length) {
            savedListing = await prisma.savedListing.create({data: {...savedListingData}})
            return NextResponse.json(savedListing)
        } else {
            return NextResponse.json(savedListing[0])
        }
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
