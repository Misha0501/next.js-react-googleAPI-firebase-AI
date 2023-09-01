export const getApplicationUserCompanyId = (applicationUser) => {
    if(!applicationUser) return null;

    let companyId = null;

    if(applicationUser.Membership && applicationUser.Membership[0] && applicationUser.Membership[0].companyId) {
        companyId = applicationUser.Membership[0].companyId;
    }

    return companyId;
}
