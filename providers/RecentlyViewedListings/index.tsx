import { useMutation, UseMutationResult, useQuery, UseQueryResult } from "react-query";
import * as api from "./api";
import { RecentlyViewedListing } from "@/types";

const KEY = "RecentlyViewedListing";

// RecentlyViewed Listings
export function useRecentlyViewedListings(
  props: RecentlyViewedListing
): UseQueryResult<any> {
  return useQuery(`${KEY} | Listings`, () => api.recentlyViewedListings(props), {
    retry: 0
  });
}

// Create
export function useCreateRecentlyViewedListing(
  props: RecentlyViewedListing
): UseMutationResult<
  RecentlyViewedListing,
  {
    listingId?: number;
  },
  RecentlyViewedListing
> {
  return useMutation((payload) => api.create({ ...props, data: payload }), {
    mutationKey: `${KEY} | Create`,
    retry: 0
  });
}
