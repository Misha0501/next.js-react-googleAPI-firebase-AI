import {
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult,
} from "@tanstack/react-query";
import * as api from "@/providers/Memberships/api";
import { Membership } from "@/types";
import { MembershipsProvider } from "@/providers/Memberships/types";

const KEY = "companyMemberships";

export function useCompanyMemberships(
  props?: MembershipsProvider.CreateProps,
): UseQueryResult<Membership[]> {
  return useQuery({
    queryKey: [`${KEY} | Items`],
    queryFn: () => api.companyMemberships(),
    enabled: props?.enabled ?? false,
    retry: 0,
  });
}

// Create
export function useCreateMembership(): UseMutationResult<
  Membership,
  any,
  MembershipsProvider.CreateMutationPayload
> {
  return useMutation<
    Membership,
    any,
    MembershipsProvider.CreateMutationPayload
  >({
    mutationFn: (payload) => api.create({ data: payload }) as Promise<Membership>,
    mutationKey: [KEY, "Create"],
    retry: 0,
  });
}
