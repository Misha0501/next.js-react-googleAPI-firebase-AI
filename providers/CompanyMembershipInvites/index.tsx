import {
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult,
} from "@tanstack/react-query";
import * as api from "@/providers/CompanyMembershipInvites/api";
import { CompanyMembershipInvite } from "@/types";
import { CompanyMembershipInvitesProvider } from "@/providers/CompanyMembershipInvites/types";

const KEY = "CompanyMembershipInvites";

export function useCompanyMembershipInvites(
  props?: CompanyMembershipInvitesProvider.POSTProps,
): UseQueryResult<CompanyMembershipInvite[], any> {
  return useQuery({
    queryKey: [`${KEY} | Items`],
    queryFn: () => api.companyMembershipInvites(),
    enabled: props?.enabled ?? false,
    retry: 0,
  });
}

// Create
export function useCreateCompanyMembershipInvites(): UseMutationResult<
  CompanyMembershipInvite,
  any,
  CompanyMembershipInvitesProvider.CreateMutationPayload
> {
  return useMutation<
    CompanyMembershipInvite,
    any,
    CompanyMembershipInvitesProvider.CreateMutationPayload
  >({
    mutationFn: (payload) =>
      api.create({ data: payload }) as Promise<CompanyMembershipInvite>,
    mutationKey: [KEY, "Create"],
    retry: 0,
  });
}

// Decline
export function useDeclineCompanyMembershipInvite(): UseMutationResult<
  CompanyMembershipInvite,
  any,
  CompanyMembershipInvitesProvider.DeclineMutationPayload
> {
  return useMutation<
    CompanyMembershipInvite,
    any,
    CompanyMembershipInvitesProvider.DeclineMutationPayload
  >({
    mutationFn: (payload) =>
      api.decline({ data: payload }) as Promise<CompanyMembershipInvite>,
    mutationKey: [KEY, "Decline"],
    retry: 0,
  });
}

// Delete
export function useDeleteCompanyMembershipInvite(): UseMutationResult<
  null,
  any,
  CompanyMembershipInvitesProvider.DeleteMutationPayload
> {
  return useMutation<
    null,
    any,
    CompanyMembershipInvitesProvider.DeleteMutationPayload
  >({
    mutationFn: (payload) =>
      api.deleteItem({ data: payload }) as Promise<null>,
    mutationKey: [KEY, "Delete"],
    retry: 0,
  });
}
