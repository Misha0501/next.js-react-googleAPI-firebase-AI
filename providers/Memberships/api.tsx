import service from "../../services";
import { MembershipsProvider } from "./types";
import type { AuthProps } from "@/providers/types";

type CreateProps = AuthProps & { data: MembershipsProvider.CreateMutationPayload };

export async function companyMemberships(props?: AuthProps) {
  return service({
    method: "GET",
    url: `/api/memberships`,
    headers: { Authorization: props?.authToken ?? "" },
  });
}

export async function create(props: CreateProps) {
  return service({
    method: "POST",
    url: `/api/memberships`,
    body: props.data as Record<string, unknown>,
    headers: { Authorization: props.authToken ?? "" },
  });
}