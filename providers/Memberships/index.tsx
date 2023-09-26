import { useMutation, useQuery, UseQueryResult } from "react-query";
import * as api from "./api";
import { SavedListing } from "@/types";

const KEY = "companyMemberships";

// RecentlyViewed Listings
export function useCompanyMemberships(
  props: SavedListing
): UseQueryResult<any> {
  return useQuery(`${KEY} | Items`, () => api.companyMemberships(props), {
    retry: 0
  });
}

// Create
export function useCreateMembership(
  props: any
) {
  // const queryClient = useQueryClient();
  return useMutation((payload) => api.create({ ...props, data: payload }), {
    mutationKey: `${KEY} | Create`,
    retry: 0
  });
}
