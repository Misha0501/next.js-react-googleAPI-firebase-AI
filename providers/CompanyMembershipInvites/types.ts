export namespace CompanyMembershipInvitesProvider {

  export type POSTProps = {
    authToken?: string | null;
  }

  export type CreateMutationPayload = {
    applicationUserEmailReceiver: string;
    applicationUserRole: string;
  }


  export type DeclineMutationPayload = {
    companyMembershipInviteId: number;
  }

  export type DeleteMutationPayload = {
    id: number;
  }

  export type ResponseError = {
    message?: string;
  }

}
