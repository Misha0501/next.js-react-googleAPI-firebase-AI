import { useAuthContext } from "@/app/context/AuthContext";
import service from "../../services";
import { Poperty } from "./types";

export async function recentlyViewedListings(props?: any): Promise<any> {
  return service({
    method: "GET",
    url: `/api/recentlyViewedListings`,
    headers: {
      //@ts-ignore
      Authorization: props.authToken,
    },
  });
}

export async function create(
  props: Poperty.CreateAPIPayload,
  authToken?: string
): Promise<Poperty.CreateResponse> {
  return service({
    method: "POST",
    url: `/api/recentlyViewedListings`,
    body: props.data,
    headers: {
      //@ts-ignore
      Authorization: props.authToken,
    },
  });
}
