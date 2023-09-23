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
