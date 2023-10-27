import { ResponseError } from "@/app/lib/classes/ResponseError";
import { getApplicationUserServer } from "@/app/lib/getApplicationUserServer";
import { handleAPIError } from "@/app/lib/api/handleError";
import { authorizeUser, deleteSavedSearch, fetchSavedSearch } from "@/app/api/savedSearches/_utils";
import { parseAndValidateParamId } from "@/app/lib/api/parseAndValidateId";

/**
 * DELETE Route to delete a saved search.
 * @param req
 * @constructor
 * @param request
 */
export async function DELETE(request: Request, {params}: { params: { slug: number } }) {
    try {
        const id = parseAndValidateParamId(params.slug);
        const applicationUser = await getApplicationUserServer();
        const savedSearch = await fetchSavedSearch(id);

        if (!savedSearch) {
            throw new ResponseError("Saved search with provided id wasn't found.", 404);
        }

        authorizeUser(applicationUser.id, savedSearch.applicationUserId);

        await deleteSavedSearch(id);

        return new Response(null, {status: 204});
    } catch (error) {
        return handleAPIError(error);
    }
}
