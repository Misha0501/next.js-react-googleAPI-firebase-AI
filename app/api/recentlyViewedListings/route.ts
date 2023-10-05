import { NextRequest, NextResponse } from "next/server";
import { ApplicationUser } from "@prisma/client";
import { z } from "zod";
import { ResponseError } from "@/app/lib/classes/ResponseError";
import { getApplicationUserServer } from "@/app/lib/getApplicationUserServer";
import { prisma } from "@/app/lib/db/client";
import { recentlyViewedListingsSchema } from "@/app/lib/validations/recentlyViewedListings";

/**
 * GET recently viewed listings of the user
 * @param req
 * @constructor
 */
export async function GET(req: NextRequest) {
    try {
        const applicationUser: ApplicationUser = await getApplicationUserServer(true);

        const itemsCount = await prisma.recentlyViewedListing.count({
            where: {
                applicationUserId: applicationUser.id,
            },
        })

        // Find last 10 recently viewed listings
        let items = await prisma.recentlyViewedListing.findMany({
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
            orderBy: {
                createdAt: 'desc'
            },
            take: 10
        })


        // let items = await prisma.recentlyViewedListing.findMany({
        //     include: {
        //         listing: {
        //             include: {
        //                 ListingImage: true,
        //                 Address: true,
        //                 ListingPrice: true
        //             }
        //         }
        //     },
        //     where: {
        //         applicationUserId: applicationUser.id,
        //     },
        // })

        return NextResponse.json({total: itemsCount, results: items})
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
 * POST Route to create recently viewed listing.
 * @param req
 * @constructor
 */
export async function POST(req: Request) {
    try {
        const applicationUser: ApplicationUser = await getApplicationUserServer(true);

        const parsedValues = recentlyViewedListingsSchema.parse(await req.json());
        const {
            listingId
        } = parsedValues

        // Create data
        const createData = {
            applicationUserId: applicationUser.id,
            listingId
        }

        let results = await prisma.recentlyViewedListing.findMany({where: {...createData},})

        // Check if last result's listingId is the same as the current one
        const lastResult = await prisma.recentlyViewedListing.findFirst({
            where: {
                applicationUserId: applicationUser.id,
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        // Check if last result's listingId is the same as the current one if so just return the last result
        if (lastResult && lastResult.listingId === listingId) {
            return NextResponse.json(lastResult)
        }

        // Else create a new one
        results = await prisma.recentlyViewedListing.create({data: {...createData}})
        return NextResponse.json(results)


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
