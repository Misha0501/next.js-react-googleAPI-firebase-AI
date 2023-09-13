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
