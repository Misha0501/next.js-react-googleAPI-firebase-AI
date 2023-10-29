import {
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult,
} from "react-query";
import * as api from "./api";
import { Membership } from "@/types";
import { MembershipsProvider } from "@/providers/Memberships/types";

const KEY = "companyMemberships";

// RecentlyViewed Listings
export function useCompanyMemberships(
  props: any
): UseQueryResult<Membership> {
  return useQuery(`${KEY} | Items`, () => api.companyMemberships(props), {
    retry: 0
  });
}

// Create
export function useCreateMembership(
  props: MembershipsProvider.CreateProps
): UseMutationResult<Membership, any, MembershipsProvider.CreateMutationPayload>{
  return useMutation((payload) => api.create({ ...props, data: payload }), {
    mutationKey: `${KEY} | Create`,
    retry: 0
  });
}
