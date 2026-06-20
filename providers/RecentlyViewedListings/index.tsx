import {
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult,
} from "@tanstack/react-query";
import * as api from "@/providers/RecentlyViewedListings/api";
import { RecentlyViewedListing } from "@/types";
import { RecentlyViewedListingsProvider } from "@/providers/RecentlyViewedListings/types";

const KEY = "RecentlyViewedListing";

export function useRecentlyViewedListings(
  props: RecentlyViewedListingsProvider.GetProps,
): UseQueryResult<RecentlyViewedListingsProvider.GetResponse> {
  const page = props.page ?? 1;
  return useQuery({
    queryKey: [`${KEY} | Listings`, page],
    queryFn: () => api.recentlyViewedListings(props),
    enabled: props?.enabled ?? false,
    retry: 0,
  });
}

// Create
export function useCreateRecentlyViewedListing(): UseMutationResult<
  RecentlyViewedListing,
  any,
  RecentlyViewedListingsProvider.CreateMutationPayload
> {
  return useMutation<
    RecentlyViewedListing,
    any,
    RecentlyViewedListingsProvider.CreateMutationPayload
  >({
    mutationFn: (payload) =>
      api.create({ data: payload }) as Promise<RecentlyViewedListing>,
    mutationKey: [KEY, "Create"],
    retry: 0,
  });
}
