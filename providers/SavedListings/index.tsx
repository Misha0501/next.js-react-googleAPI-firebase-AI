import { useMutation, UseMutationResult, useQuery, UseQueryResult } from "react-query";
import * as api from "./api";
import { RecentlyViewedListing, SavedListing } from "@/types";

const KEY = "SavedListings";

// RecentlyViewed Listings
export function useSavedListings(
  props: SavedListing
): UseQueryResult<any> {
  return useQuery(`${KEY} | Items`, () => api.savedListings(props), {
    retry: 0
  });
}

// Create
export function useCreateSavedListing(
  props: SavedListing
): UseMutationResult<
  SavedListing,
  {
    listingId?: number;
  },
  SavedListing
> {
  // const queryClient = useQueryClient();
  return useMutation((payload) => api.create({ ...props, data: payload }), {
    mutationKey: `${KEY} | Create`,
    retry: 0
  });
}



// Delete
export function useDeleteSavedListing(
  props: SavedListing
): UseMutationResult<
  SavedListing,
  {
    listingId?: number;
  },
  SavedListing
> {
  return useMutation((payload) => api.deleteItem({ ...props, data: payload }), {
    mutationKey: `${KEY} | Delete`,
    retry: 0
  });
}
