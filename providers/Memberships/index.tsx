import {
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult,
} from "react-query";
import * as api from "@/providers/Memberships/api";
import { Membership } from "@/types";
import { MembershipsProvider } from "@/providers/Memberships/types";

const KEY = "companyMemberships";

// RecentlyViewed Listings
export function useCompanyMemberships(
  props: MembershipsProvider.CreateProps,
): UseQueryResult<Membership> {
  return useQuery(`${KEY} | Items`, () => api.companyMemberships(props), {
    enabled: !!props?.authToken,
    retry: 0,
  });
}

// Create
export function useCreateMembership(
  props: MembershipsProvider.CreateProps,
): UseMutationResult<
  Membership,
  any,
  MembershipsProvider.CreateMutationPayload
> {
  return useMutation<
    Membership,
    any,
    MembershipsProvider.CreateMutationPayload
  >(
    (payload) => api.create({ ...props, data: payload }) as Promise<Membership>,
    { mutationKey: `${KEY} | Create`, retry: 0 },
  );
}
