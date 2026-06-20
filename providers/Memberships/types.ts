export namespace MembershipsProvider {
  export type CreateProps = {
    enabled?: boolean;
  };

  export type CreateMutationPayload = {
    companyMembershipInviteId: number;
  };
}
