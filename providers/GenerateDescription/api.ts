import service from "@/services";
import { Description } from "./types";
import { useAuthContext } from "@/app/context/AuthContext";

// Create
export async function generate(
  props: Description.CreateAPIPayload
): Promise<Description.CreateResponse> {
  return service({
    method: "POST",
    url: `/api/generateDescription`,
    body: props.data,
    // headers: {
    //   Authorization: authToken,
    // },
  });
}
