import { Listing } from "@/types";

/**
 * Check if user is allowed to manipulate listing
 * @param applicationUserId
 * @param applicationUserCompanyId
 * @param listing
 */
export const userAllowedManipulateListing = (applicationUserId: number, applicationUserCompanyId: number | null, listing: Listing) => {
    if(!listing) return false;

    const listingOwnerId = listing.applicationUserId;
    const listingCompanyId = listing.companyId;

    if(!applicationUserId || !listingOwnerId) return false;

    if(applicationUserId === listingOwnerId) return true;

    if(!listingCompanyId) return false;

    return listingCompanyId === applicationUserCompanyId;
}
