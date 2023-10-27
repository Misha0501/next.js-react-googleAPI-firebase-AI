import { getApplicationUserServer } from "@/app/lib/getApplicationUserServer";
import { ApplicationUser } from "@prisma/client";
import { deleteImageFromDB, ensureListingAndUserPermissions, fetchImageById } from "@/app/api/images/[slug]/_utils";
import { handleAPIError } from "@/app/lib/api/handleError";
import { validateParamId } from "@/app/lib/api/validateParamId";

/**
 * DELETE Route to delete a listing.
 * @param req
 * @constructor
 * @param request
 */
export async function DELETE(
  request: Request,
  {
    params,
  }: {
    params: {
      slug: number;
    };
  },
) {
  try {
    const id = validateParamId(params.slug);

    const applicationUser: ApplicationUser = await getApplicationUserServer();

    const { listingId } = await fetchImageById(id);

    await ensureListingAndUserPermissions(applicationUser, listingId);

    await deleteImageFromDB(id);

    return new Response(null, { status: 204 });
  } catch (error) {
    return handleAPIError(error);
  }
}
