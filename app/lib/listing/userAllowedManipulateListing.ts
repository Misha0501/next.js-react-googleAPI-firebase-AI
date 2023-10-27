import { Listing } from "@/types";

/**
 * Checks if a user is authorized to manipulate a given listing.
 *
 * @param {number} applicationUserId - The ID of the application user.
 * @param {number|null} applicationUserCompanyId - The company ID of the application user.
 * @param {Listing} listing - The target listing.
 * @returns {boolean} - `true` if the user is allowed to manipulate the listing, otherwise `false`.
 */
export const userAllowedManipulateListing = (
  applicationUserId: number,
  applicationUserCompanyId: number | null,
  listing: Listing,
): boolean => {
  if (!listing) return false;

  const listingOwnerId = listing.applicationUserId;
  const listingCompanyId = listing.companyId;

  if (!applicationUserId || !listingOwnerId) return false;

  if (applicationUserId === listingOwnerId) return true;

  if (!listingCompanyId) return false;

  return listingCompanyId === applicationUserCompanyId;
};
