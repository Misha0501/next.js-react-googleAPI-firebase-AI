import { ResponseError } from "@/app/lib/classes/ResponseError";
import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/db/client";
import { getApplicationUserServer } from "@/app/lib/getApplicationUserServer";
import { ApplicationUser } from "@/types";
import { getAveragePriceInNeighborhood } from "@/app/lib/listing/getAveragePriceInNeighborhood";
import {
    deleteListingAndAssociatedEntities,
    ensureUserHasListingAccess,
    validateListingExistence
} from "@/app/api/listings/_utils";
import { handleAPIError } from "@/app/lib/api/handleError";
import { validateParamId } from "@/app/lib/api/validateParamId";

/**
 * GET Route to retrieve specific listing with provided slug.
 * @param req
 * @constructor
 * @param request
 */
export async function GET(request: Request, {params}: { params: { slug: number } }) {
    try {
        const id = validateParamId(params.slug);

        const listing = await prisma.listing.findUnique({
            where: {
                id,
                deleted: null,
            },
            include: {
                applicationUser: true,
                company: true,
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
        return handleAPIError(error);
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
        const id = validateParamId(params.slug);

        const applicationUser: ApplicationUser = await getApplicationUserServer(true);

        const listing = await validateListingExistence(id);

        ensureUserHasListingAccess(applicationUser, listing);

        await deleteListingAndAssociatedEntities(id);

        return new Response(null, { status: 204 });
    } catch (error) {
        return handleAPIError(error);
    }
}
