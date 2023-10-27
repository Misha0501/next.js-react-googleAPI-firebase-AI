import { prisma } from "@/app/lib/db/client";
import { ResponseError } from "@/app/lib/classes/ResponseError";

/**
 * Retrieves the saved listings for a specific user.
 *
 * @param {number} userId - The ID of the user.
 * @returns {Promise<{total: number, results: any[]}>} - An object containing the total number of saved listings and the saved listings themselves.
 */
export const getSavedListings = async (userId: number): Promise<any> => {
  const savedListingsCount = await prisma.savedListing.count({
    where: {
      applicationUserId: userId,
    },
  });

  const savedListings = await prisma.savedListing.findMany({
    include: {
      listing: {
        include: {
          ListingImage: true,
          Address: true,
          ListingPrice: true,
        },
      },
    },
    where: {
      applicationUserId: userId,
    },
  });

  return { total: savedListingsCount, results: savedListings };
};

/**
 * Handles the creation or retrieval of a saved listing record for a user.
 * If the listing was already saved by the user, the existing record is returned.
 * Otherwise, a new saved listing record is created.
 *
 * @param {number} userId - The ID of the user.
 * @param {number} listingId - The ID of the listing.
 * @returns {Promise<any>} - The saved listing record.
 */
export const handleSavedListingCreation = async (
  userId: number,
  listingId: number,
): Promise<any> => {
  const savedListingData = {
    applicationUserId: userId,
    listingId,
  };

  const existingSavedListing = await prisma.savedListing.findMany({
    where: { ...savedListingData },
  });

  if (!existingSavedListing || !existingSavedListing.length) {
    return await prisma.savedListing.create({ data: { ...savedListingData } });
  }

  return existingSavedListing[0];
};

/**
 * Fetches a specific saved listing by its ID.
 *
 * @param {number} id - The ID of the saved listing.
 * @returns {Promise<any>} - The saved listing record.
 */
export const fetchSavedListing = async (id: number): Promise<any> => {
  return await prisma.savedListing.findUnique({
    where: { id },
  });
};

/**
 * Validates if a user is authorized to perform operations on a specific saved listing.
 * Throws an error if the user is not authorized.
 *
 * @param {number} applicationUserId - The ID of the application user.
 * @param {any} savedListing - The saved listing object.
 * @throws {ResponseError} - Throws error if user is not authorized.
 */
export const validateUserAuthorization = (
  applicationUserId: number,
  savedListing: any,
): void => {
  if (applicationUserId !== savedListing.applicationUserId) {
    throw new ResponseError("You aren't allowed to change this property", 401);
  }
};

/**
 * Deletes a saved listing based on its ID.
 *
 * @param {number} id - The ID of the saved listing to be deleted.
 * @returns {Promise<void>}
 */
export const deleteSavedListing = async (id: number): Promise<void> => {
  await prisma.savedListing.delete({
    where: { id },
  });
};
