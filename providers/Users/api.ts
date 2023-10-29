import service from "../../services";
import { ApplicationUserProvider } from "./types";
import { ApplicationUser } from "@/types";

export async function userDetail(
  props?: any,
): Promise<ApplicationUserProvider.DetailResponse> {
  return service({
    method: "GET",
    url: `/api/users/${props?.id}`,
  });
}

export async function userOwnData(
  props?: any
): Promise<ApplicationUserProvider.DetailResponse> {
  return service({
    method: "GET",
    url: `/api/users`,
    headers: {
      Authorization: props?.authToken,
    },
  });
}

export async function update(
  props?: any,
): Promise<ApplicationUser> {
  return service({
    method: "PUT",
    url: `/api/users`,
    body: props?.data,
    headers: {
      Authorization: props?.authToken || props?.data?.authToken,
    },
  });
}
