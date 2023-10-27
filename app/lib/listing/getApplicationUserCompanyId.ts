import { ApplicationUser } from "@/types";

/**
 * Retrieves the company ID associated with an application user from their membership details.
 *
 * @param {ApplicationUser} applicationUser - The application user object.
 * @returns {number|null} - The company ID or null if not available.
 */
export const getApplicationUserCompanyId = (applicationUser: ApplicationUser) => {
    if(!applicationUser) return null;

    let companyId = null;

    if(applicationUser.Membership && applicationUser.Membership[0] && applicationUser.Membership[0].companyId) {
        companyId = applicationUser.Membership[0].companyId;
    }

    return companyId;
}
