import { prisma } from "@/app/lib/db/client";
import { ResponseError } from "@/app/lib/classes/ResponseError";
import { ApplicationUser } from "@/types";
import { getApplicationUserCompanyId } from "@/app/lib/listing/getApplicationUserCompanyId";
import { userAllowedManipulateListing } from "@/app/lib/listing/userAllowedManipulateListing";

/**
 * Fetches an image by its ID and also retrieves the associated listing ID.
 *
 * @param {number} id - The ID of the image to fetch.
 * @returns {Promise<{image: any, listingId: number | undefined}>} - An object containing the image and its associated listing ID.
 * @throws {ResponseError} - Throws an error if the associated listing ID is not found.
 */
export const fetchImageById = async (
  id: number,
): Promise<{ image: any; listingId: number | undefined }> => {
  const image = await prisma.listingImage.findUnique({
    where: {
      id,
    },
  });
  const listingId = image?.listingId;
  if (!listingId)
    throw new ResponseError(
      "Listing with provided image id wasn't found.",
      404,
    );
  return { image, listingId };
};

/**
 * Ensures the user has permissions for a specific listing.
 *
 * @param {ApplicationUser} applicationUser - The application user object.
 * @param {number} listingId - The ID of the listing to check permissions for.
 * @returns {Promise<void>} - Resolves if the user has permissions, otherwise throws an error.
 * @throws {ResponseError} - Throws an error if the listing is not found or the user does not have the necessary permissions.
 */
export const ensureListingAndUserPermissions = async (
  applicationUser: ApplicationUser,
  listingId: number,
): Promise<void> => {
  const listing = await prisma.listing.findUnique({
    where: {
      id: listingId,
      deleted: null,
    },
  });
  if (!listing)
    throw new ResponseError(
      "Listing with provided image id wasn't found.",
      404,
    );
  const applicationUserCompanyId = getApplicationUserCompanyId(applicationUser);
  if (
    !userAllowedManipulateListing(
      applicationUser.id,
      applicationUserCompanyId,
      listing,
    )
  ) {
    throw new ResponseError("You aren't allowed to changed this property", 401);
  }
};

/**
 * Deletes an image from the database by its ID.
 *
 * @param {number} id - The ID of the image to delete.
 * @returns {Promise<void>} - Resolves once the image is deleted.
 */
export const deleteImageFromDB = async (id: number): Promise<void> => {
  await prisma.listingImage.delete({
    where: { id },
  });
};
