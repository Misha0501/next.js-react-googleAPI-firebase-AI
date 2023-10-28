import service from "../../services";
import { SavedListingsProvider } from "@/providers/SavedListings/types";
import { SavedListing } from "@/types";

export async function savedListings(
  props?: any,
): Promise<SavedListingsProvider.ReadResponse> {
  return service({
    method: "GET",
    url: `/api/savedListings`,
    headers: {
      //@ts-ignore
      Authorization: props.authToken,
    },
  });
}

export async function create(props: any): Promise<SavedListing> {
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

export async function deleteItem(props: any): Promise<null> {
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
