import { ResponseError } from "@/app/lib/classes/ResponseError";
import { getApplicationUserServer } from "@/app/lib/getApplicationUserServer";
import { ApplicationUser } from "@/types";
import { deleteSavedListing, fetchSavedListing, validateUserAuthorization } from "@/app/api/savedListings/_utils";
import { handleAPIError } from "@/app/lib/api/handleError";

/**
 * DELETE Route to delete a saved listing.
 * @param req
 * @constructor
 * @param request
 */
export async function DELETE(
  request: Request,
  { params }: { params: { slug: number } },
) {
  try {
    const id = Number(params.slug);

    if (isNaN(id)) throw new ResponseError("ID must be a valid number", 422);

    const applicationUser: ApplicationUser = await getApplicationUserServer();

    const savedListing = await fetchSavedListing(id);

    if (!savedListing) {
      throw new ResponseError(
        "Saved listing with provided id wasn't found.",
        404,
      );
    }

    validateUserAuthorization(applicationUser.id, savedListing);

    await deleteSavedListing(id);

    return new Response(null, { status: 204 });
  } catch (error) {
    return handleAPIError(error);
  }
}
