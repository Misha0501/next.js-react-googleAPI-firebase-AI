import service from "@/services";
import { CompanyProvider } from "./types";
import type { AuthProps } from "@/providers/types";

type CreateProps = AuthProps & { data: CompanyProvider.CreateMutation };
type UpdateProps = AuthProps & { data: CompanyProvider.UpdateMutation };

export async function create(props: CreateProps) {
  return service({
    method: "POST",
    url: `/api/companies`,
    body: props.data as Record<string, unknown>,
    headers: { Authorization: props.authToken ?? "" },
  });
}

export async function update(props: UpdateProps) {
  return service({
    method: "PUT",
    url: `/api/companies`,
    body: props.data as Record<string, unknown>,
    headers: { Authorization: props.authToken ?? "" },
  });
}

