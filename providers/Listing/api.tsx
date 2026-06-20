import service from "@/services";
import { Listing } from "@/types";
import { ListingProvider } from "@/providers/Listing/types";

export async function listing(
  props?: ListingProvider.ListingAPIPayload,
): Promise<ListingProvider.ListingsResponse> {
  return service({
    method: "GET",
    url: `/api/listings`,
    queryParams: props,
  });
}

export async function listingDetailPage(
  props?: ListingProvider.DetailProps,
): Promise<Listing> {
  return service({
    method: "GET",
    url: `/api/listings/${props?.id}`,
  });
}

export async function create(
  props: ListingProvider.CreateAPIPayload,
): Promise<Listing> {
  return service({
    method: "POST",
    url: `/api/listings`,
    body: props.data,
  });
}

export async function updateProperty(
  props: ListingProvider.PutAPIPayload,
): Promise<Listing> {
  return service({
    method: "PUT",
    url: `/api/listings`,
    body: props.data,
  });
}

export async function deleteItem(
  props: ListingProvider.DeleteProps,
): Promise<null> {
  return service({
    method: "DELETE",
    parseJSON: false,
    url: `/api/listings/${props.data.id}`,
    body: props.data,
  });
}
