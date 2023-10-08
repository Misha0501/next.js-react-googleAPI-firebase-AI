import { z } from "zod";
import { ResponseError } from "@/app/lib/classes/ResponseError";
import { prisma } from "@/app/lib/db/client";
import { getApplicationUserServer } from "@/app/lib/getApplicationUserServer";
import { ApplicationUser } from "@prisma/client";
import { userAllowedManipulateListing } from "@/app/lib/listing/userAllowedManipulateListing";
import { getApplicationUserCompanyId } from "@/app/lib/listing/getApplicationUserCompanyId";

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

        const image = await prisma.listingImage.findUnique({
            where: {
                id
            },
        })

        const listingId = image?.listingId;
        if(!listingId) throw new ResponseError("Listing with provided image id wasn't found.", 404)


        const listing = await prisma.listing.findUnique({
            where: {
                id: listingId,
                deleted: null,
            },
        })

        if(!listing) throw new ResponseError("Listing with provided image id wasn't found.", 404)

        let applicationUserCompanyId = getApplicationUserCompanyId(applicationUser);


        if (!userAllowedManipulateListing(applicationUserId, applicationUserCompanyId, listing)) throw new ResponseError("You aren't allowed to changed this property", 401)


        await prisma.listingImage.delete({
            where: {id}
        })

        // TODO: Delete image from firebase storage



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
