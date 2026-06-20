import service from "@/services";
import { MembershipsProvider } from "@/providers/Memberships/types";
import type { Membership } from "@/types";

type CreateProps = {
  data: MembershipsProvider.CreateMutationPayload;
};

export async function companyMemberships(): Promise<Membership[]> {
  return service({
    method: "GET",
    url: `/api/memberships`,
  });
}

export async function create(props: CreateProps): Promise<Membership> {
  return service({
    method: "POST",
    url: `/api/memberships`,
    body: props.data as Record<string, unknown>,
  });
}
