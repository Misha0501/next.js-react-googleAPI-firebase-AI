import { User } from "firebase/auth";
import service from "../../services";
import { Users } from "./types";

export async function userDetail(
  props?: Users.DetailAPIPayload
): Promise<Users.DetailResponse> {
  return service({
    method: "GET",
    url: `/api/users/${props?.id}`,
  });
}

export async function userOwnData(
  props?: Users.DetailAPIPayload
): Promise<Users.DetailResponse> {
  return service({
    method: "GET",
    url: `/api/users`,
    headers: {
      //@ts-ignore
      Authorization: props.authToken,
    },
  });
}

export async function update(
  props: any,
) {
  return service({
    method: "PUT",
    url: `/api/users`,
    body: props.data,
    headers: {
      //@ts-ignore
      Authorization: props.authToken || props.data.authToken,
    },
  });
}

