import { z } from "zod";
import { ResponseError } from "@/classes/ResponseError";
import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/db/client";
import { getApplicationUserServer } from "@/app/lib/getApplicationUserServer";
import { ApplicationUser } from "@prisma/client";
import { userAllowedManipulateListing } from "@/app/lib/listing/userAllowedManipulateListing";
import { getApplicationUserCompanyId } from "@/app/lib/listing/getApplicationUserCompanyId";
import { getAveragePriceInNeighborhood } from "@/app/lib/listing/getAveragePriceInNeighborhood";

/**
 * GET Route to retrieve specific listing with provided slug.
 * @param req
 * @constructor
 * @param request
 */
export async function GET(request: Request, {params}: { params: { slug: number } }) {
    try {
        const id = Number(params.slug)

        if (isNaN(id)) throw new ResponseError("ID must be a valid number", 422);

        const listing = await prisma.listing.findUnique({
            where: {
                id,
                deleted: null,
            },
            include: {
                ListingImage: true,
                Address: true,
                ListingPrice: true,
            },
        });

        if (!listing) throw new ResponseError("Listing with provided id wasn't found.", 404)

        // Get average price in the neighborhood of the listing
        listing.averagePriceInNeighborhood = await getAveragePriceInNeighborhood(listing);

        return NextResponse.json(listing);
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
 * DELETE Route to delete a listing.
 * @param req
 * @constructor
 * @param request
 */
export async function DELETE(request: Request, {params}: { params: { slug: number } }) {
    try {
        const id = Number(params.slug)

        if (isNaN(id)) throw new ResponseError("ID must be a valid number", 422);

        const applicationUser: ApplicationUser = await getApplicationUserServer();

        const applicationUserId = applicationUser.id;
        const listing = await prisma.listing.findUnique({
            where: {
                id,
                deleted: null,
            },
        })

        let applicationUserCompanyId = getApplicationUserCompanyId(applicationUser);

        if (!listing) throw new ResponseError("Listing with provided id wasn't found.", 404)

        if (!userAllowedManipulateListing(applicationUserId, applicationUserCompanyId, listing)) throw new ResponseError("You aren't allowed to changed this property", 401)

        const deleteListingImages = prisma.listingImage.deleteMany({
            where: {
                listingId: id,
            },
        })

        const deleteListingAddress = prisma.address.deleteMany({
            where: {
                listingId: id,
            },
        })

        const deleteListingPrices = prisma.listingImage.deleteMany({
            where: {
                listingId: id,
            },
        })

        const deleteListing = prisma.listing.delete({
            where: {id}
        })

        await prisma.$transaction([deleteListingImages, deleteListingAddress, deleteListingPrices, deleteListing])

        return new Response(null, {status: 204})
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
