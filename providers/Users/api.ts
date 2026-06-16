import service from "@/services";
import { ApplicationUserProvider } from "@/providers/Users/types";
import { ApplicationUser } from "@/types";

type UpdateProps = ApplicationUserProvider.GetProps & {
  data: ApplicationUserProvider.UpdatePropsMutation;
};

export async function userDetail(
  props?: ApplicationUserProvider.GetProps,
): Promise<ApplicationUserProvider.DetailResponse> {
  return service<ApplicationUserProvider.DetailResponse>({
    method: "GET",
    url: `/api/users/${props?.id}`,
  });
}

export async function userOwnData(
  props?: ApplicationUserProvider.GetProps,
): Promise<ApplicationUserProvider.DetailResponse> {
  return service<ApplicationUserProvider.DetailResponse>({
    method: "GET",
    url: `/api/users`,
    headers: { Authorization: props?.authToken ?? "" },
  });
}

export async function update(props?: UpdateProps): Promise<ApplicationUser> {
  return service<ApplicationUser>({
    method: "PUT",
    url: `/api/users`,
    body: props?.data as Record<string, unknown>,
    headers: { Authorization: props?.authToken ?? "" },
  });
}
