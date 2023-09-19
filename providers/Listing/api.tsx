import { useAuthContext } from "@/app/context/AuthContext";
import service from "../../services";
import { Poperty } from "./types";

export async function listing(props?: Poperty.ListingAPIPayload): Promise<any> {
  return service({
    method: "GET",
    url: `/api/listings`,
    queryParams: props,
  });
}

export async function listingDetailPage(
  props?: Poperty.listingDetailPageAPIPayload
): Promise<Poperty.listingDetailPageResponse> {
  return service({
    method: "GET",
    url: `/api/listings/${props?.id}`,
  });
}

export async function create(
  props: Poperty.CreateAPIPayload,
  authToken?: string
): Promise<Poperty.CreateResponse> {
  return service({
    method: "POST",
    url: `/api/listings`,
    body: props.data,
    headers: {
      //@ts-ignore
      Authorization: props.authToken,
    },
  });
}

export async function updateProperty(
  props: Poperty.PutAPIPayload,
  authToken?: string
): Promise<Poperty.UpdatePropertyResponse> {
  return service({
    method: "PUT",
    url: `/api/listings`,
    body: props.data,
    headers: {
      //@ts-ignore
      Authorization: props.authToken,
    },
  });
}
