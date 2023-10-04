import { useAuthContext } from "@/app/context/AuthContext";
import service from "../../services";
import { Poperty } from "./types";

export async function savedSearches(props?: any): Promise<any> {
  return service({
    method: "GET",
    url: `/api/savedSearches`,
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
    url: `/api/savedSearches`,
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
    url: `/api/savedSearches/${props.data.id}`,
    body: props.data,
    headers: {
      //@ts-ignore
      Authorization: props.authToken,
    },
  });
}
