export const userAllowedManipulateListing = (applicationUserId, applicationUserCompanyId, listing) => {
    if(!listing) return false;

    const listingOwnerId = listing.applicationUserId;
    const listingCompanyId = listing.companyId;

    if(!applicationUserId || !listingOwnerId) return false;

    if(applicationUserId === listingOwnerId) return true;

    if(!listingCompanyId) return false;

    return listingCompanyId === applicationUserCompanyId;
}