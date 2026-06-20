import service from "@/services";
import { CompanyProvider } from "@/providers/Companies/types";
import type { Company } from "@/types";

type CreateProps = { data: CompanyProvider.CreateMutation };
type UpdateProps = { data: CompanyProvider.UpdateMutation };

export async function create(props: CreateProps): Promise<Company> {
  return service({
    method: "POST",
    url: `/api/companies`,
    body: props.data as Record<string, unknown>,
  });
}

export async function update(props: UpdateProps): Promise<Company> {
  return service({
    method: "PUT",
    url: `/api/companies`,
    body: props.data as Record<string, unknown>,
  });
}
