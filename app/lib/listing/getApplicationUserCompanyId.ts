import { ApplicationUser } from "@/types";

/**
 * Get the company id of the application user
 * @param applicationUser ApplicationUser
 */
export const getApplicationUserCompanyId = (applicationUser: ApplicationUser) => {
    if(!applicationUser) return null;

    let companyId = null;

    if(applicationUser.Membership && applicationUser.Membership[0] && applicationUser.Membership[0].companyId) {
        companyId = applicationUser.Membership[0].companyId;
    }

    return companyId;
}
