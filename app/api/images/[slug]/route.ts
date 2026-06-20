import { requireUser } from "@/app/lib/auth/requireUser";
import {
  deleteImageFromDB,
  ensureListingAndUserPermissions,
  fetchImageById,
} from "@/app/api/images/[slug]/_utils";
import { handleAPIError } from "@/app/lib/api/handleError";
import { validateParamId } from "@/app/lib/api/validateParamId";
import { getFirebaseAdminBucket } from "@/app/lib/firebase/configAdminStorage";

/**
 * DELETE Route to delete a listing.
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

    const { user: applicationUser } = await requireUser();

    const { image, listingId } = await fetchImageById(id);

    await ensureListingAndUserPermissions(applicationUser, listingId!);

    await deleteImageFromDB(id);

    if (image?.imagePath) {
      await getFirebaseAdminBucket()
        .file(image.imagePath)
        .delete({ ignoreNotFound: true });
    }

    return new Response(null, { status: 204 });
  } catch (error) {
    return handleAPIError(error);
  }
}
