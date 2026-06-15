import service from "../../services";
import { RecentlyViewedListingsProvider } from "./types";

type CreateProps = RecentlyViewedListingsProvider.CreateProps & {
  data: RecentlyViewedListingsProvider.CreateMutationPayload;
};

export async function recentlyViewedListings(
  props?: RecentlyViewedListingsProvider.GetProps,
): Promise<RecentlyViewedListingsProvider.GetResponse> {
  return service<RecentlyViewedListingsProvider.GetResponse>({
    method: "GET",
    url: `/api/recentlyViewedListings`,
    headers: { Authorization: props?.authToken ?? "" },
  });
}

export async function create(props: CreateProps) {
  return service({
    method: "POST",
    url: `/api/recentlyViewedListings`,
    body: props.data as Record<string, unknown>,
    headers: { Authorization: props.authToken ?? "" },
  });
}
