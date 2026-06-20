import service from "@/services";
import { CompanyMembershipInvitesProvider } from "@/providers/CompanyMembershipInvites/types";
import type { CompanyMembershipInvite } from "@/types";

type CreateProps = {
  data: CompanyMembershipInvitesProvider.CreateMutationPayload;
};
type DeclineProps = {
  data: CompanyMembershipInvitesProvider.DeclineMutationPayload;
};
type DeleteProps = {
  data: CompanyMembershipInvitesProvider.DeleteMutationPayload;
};

export async function companyMembershipInvites(): Promise<
  CompanyMembershipInvite[]
> {
  return service({
    method: "GET",
    url: `/api/companyMembershipInvites`,
  });
}

export async function create(
  props: CreateProps,
): Promise<CompanyMembershipInvite> {
  return service({
    method: "POST",
    url: `/api/companyMembershipInvites`,
    body: props.data as Record<string, unknown>,
  });
}

export async function decline(
  props: DeclineProps,
): Promise<CompanyMembershipInvite> {
  return service({
    method: "POST",
    url: `/api/companyMembershipInvites/decline`,
    body: props.data as Record<string, unknown>,
  });
}

export async function deleteItem(props: DeleteProps): Promise<null> {
  return service({
    method: "DELETE",
    parseJSON: false,
    url: `/api/companyMembershipInvites/${props.data.id}`,
  });
}
