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
  props: RecentlyViewedListingsProvider.GetProps
): UseQueryResult<RecentlyViewedListingsProvider.GetResponse> {
  return useQuery(`${KEY} | Listings`, () => api.recentlyViewedListings(props), {
    retry: 0
  });
}

// Create
export function useCreateRecentlyViewedListing(
  props: RecentlyViewedListingsProvider.CreateProps
): UseMutationResult<
  RecentlyViewedListing,
  any,
  RecentlyViewedListingsProvider.CreateMutationPayload
> {
  return useMutation((payload) => api.create({ ...props, data: payload }), {
    mutationKey: `${KEY} | Create`,
    retry: 0
  });
}
