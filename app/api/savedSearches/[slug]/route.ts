import { ResponseError } from "@/app/lib/classes/ResponseError";
import { requireUser } from "@/app/lib/auth/requireUser";
import { handleAPIError } from "@/app/lib/api/handleError";
import {
  authorizeUser,
  deleteSavedSearch,
  fetchSavedSearch,
} from "@/app/api/savedSearches/_utils";
import { validateParamId } from "@/app/lib/api/validateParamId";

/**
 * DELETE Route to delete a saved search.
 * @param req
 * @constructor
 * @param request
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    const id = validateParamId(slug);
    const { user: applicationUser } = await requireUser(request);
    const savedSearch = await fetchSavedSearch(id);

    if (!savedSearch) {
      throw new ResponseError(
        "Saved search with provided id wasn't found.",
        404,
      );
    }

    authorizeUser(applicationUser.id, savedSearch.applicationUserId);

    await deleteSavedSearch(id);

    return new Response(null, { status: 204 });
  } catch (error) {
    return handleAPIError(error);
  }
}
