import service from "../../services";
import { Poperty } from "./types";

export async function listing(props?: Poperty.ListingAPIPayload): Promise<any> {
  return service({
    method: "GET",
    url: `/api/listings`,
    queryParams: props,
  });
}
