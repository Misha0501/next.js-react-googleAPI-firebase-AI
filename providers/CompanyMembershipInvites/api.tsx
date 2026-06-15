import service from "../../services";
import { CompanyMembershipInvitesProvider } from "./types";
import type { CompanyMembershipInvite } from "@/types";

type ReadProps = CompanyMembershipInvitesProvider.POSTProps;
type CreateProps = ReadProps & { data: CompanyMembershipInvitesProvider.CreateMutationPayload };
type DeclineProps = ReadProps & { data: CompanyMembershipInvitesProvider.DeclineMutationPayload };
type DeleteProps = ReadProps & { data: CompanyMembershipInvitesProvider.DeleteMutationPayload };

export async function companyMembershipInvites(props?: ReadProps): Promise<CompanyMembershipInvite[]> {
  return service({
    method: "GET",
    url: `/api/companyMembershipInvites`,
    headers: { Authorization: props?.authToken ?? "" },
  });
}

export async function create(props: CreateProps): Promise<CompanyMembershipInvite> {
  return service({
    method: "POST",
    url: `/api/companyMembershipInvites`,
    body: props.data as Record<string, unknown>,
    headers: { Authorization: props.authToken ?? "" },
  });
}

export async function decline(props: DeclineProps): Promise<CompanyMembershipInvite> {
  return service({
    method: "POST",
    url: `/api/companyMembershipInvites/decline`,
    body: props.data as Record<string, unknown>,
    headers: { Authorization: props.authToken ?? "" },
  });
}

export async function deleteItem(props: DeleteProps): Promise<null> {
  return service({
    method: "DELETE",
    parseJSON: false,
    url: `/api/companyMembershipInvites/${props.data.id}`,
    headers: { Authorization: props.authToken ?? "" },
  });
}
