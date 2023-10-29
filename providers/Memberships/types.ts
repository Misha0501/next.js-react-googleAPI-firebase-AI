export namespace MembershipsProvider {

  export type CreateProps = {
    authToken?: string;
  }

  export type CreateMutationPayload = {
    companyMembershipInviteId: number;
  }
}
