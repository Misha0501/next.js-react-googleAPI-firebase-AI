import { useAuthContext } from "@/app/context/AuthContext";
import service from "../../services";
import { Poperty } from "./types";

export async function savedListings(props?: any): Promise<any> {
  return service({
    method: "GET",
    url: `/api/savedListings`,
    queryParams: props,
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
    url: `/api/savedListings`,
    body: props.data,
    headers: {
      //@ts-ignore
      Authorization: props.authToken,
    },
  });
}

export async function deleteItem(props: any) {
  return service({
    method: "DELETE",
    parseJSON: false,
    url: `/api/savedListings/${props.data.id}`,
    body: props.data,
    headers: {
      //@ts-ignore
      Authorization: props.authToken,
    },
  });
}
