import service from "@/services";
import { RecentlyViewedListingsProvider } from "@/providers/RecentlyViewedListings/types";

type CreateProps = {
  data: RecentlyViewedListingsProvider.CreateMutationPayload;
};

export async function recentlyViewedListings(
  props?: RecentlyViewedListingsProvider.GetProps,
): Promise<RecentlyViewedListingsProvider.GetResponse> {
  const page = props?.page ?? 1;
  return service<RecentlyViewedListingsProvider.GetResponse>({
    method: "GET",
    url: `/api/recentlyViewedListings?page=${page}&pageSize=8`,
  });
}

export async function create(props: CreateProps) {
  return service({
    method: "POST",
    url: `/api/recentlyViewedListings`,
    body: props.data as Record<string, unknown>,
  });
}
