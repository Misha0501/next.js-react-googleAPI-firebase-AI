import {z} from "zod";
import {ResponseError} from "@/app/lib/classes/ResponseError";
import {prisma} from "@/app/lib/db/client";
import {getApplicationUserServer} from "@/app/lib/getApplicationUserServer";
import {ApplicationUser} from '@prisma/client'

/**
 * DELETE Route to delete a saved search.
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
        const savedSearch = await prisma.savedSearch.findUnique({
            where: {
                id,
            },
        })

        if (!savedSearch) throw new ResponseError("Saved search with provided id wasn't found.", 404)

        if (applicationUserId !== savedSearch.applicationUserId) throw new ResponseError("You aren't allowed to changed this property", 401)

        await prisma.savedSearch.delete({
            where: {id}
        })

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
