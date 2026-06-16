import {
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult,
} from "react-query";
import * as api from "./api";
import { RecentlyViewedListing } from "@/types";
import { RecentlyViewedListingsProvider } from "@/providers/RecentlyViewedListings/types";

const KEY = "RecentlyViewedListing";

// RecentlyViewed Listings
export function useRecentlyViewedListings(
  props: RecentlyViewedListingsProvider.GetProps,
): UseQueryResult<RecentlyViewedListingsProvider.GetResponse> {
  const page = props.page ?? 1;
  return useQuery(
    [`${KEY} | Listings`, page],
    () => api.recentlyViewedListings(props),
    {
      enabled: !!props?.authToken,
      retry: 0,
    },
  );
}

// Create
export function useCreateRecentlyViewedListing(
  props: RecentlyViewedListingsProvider.CreateProps,
): UseMutationResult<
  RecentlyViewedListing,
  any,
  RecentlyViewedListingsProvider.CreateMutationPayload
> {
  return useMutation<
    RecentlyViewedListing,
    any,
    RecentlyViewedListingsProvider.CreateMutationPayload
  >(
    (payload) =>
      api.create({ ...props, data: payload }) as Promise<RecentlyViewedListing>,
    { mutationKey: `${KEY} | Create`, retry: 0 },
  );
}
