import {
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult,
} from "react-query";
import * as api from "./api";
import { CompanyMembershipInvite } from "@/types";
import { CompanyMembershipInvitesProvider } from "@/providers/CompanyMembershipInvites/types";

const KEY = "CompanyMembershipInvites";

export function useCompanyMembershipInvites(
  props: CompanyMembershipInvitesProvider.POSTProps,
): UseQueryResult<CompanyMembershipInvite[], any> {
  return useQuery(`${KEY} | Items`, () => api.companyMembershipInvites(props), {
    retry: 0,
  });
}

// Create
export function useCreateCompanyMembershipInvites(
  props: CompanyMembershipInvitesProvider.POSTProps,
): UseMutationResult<
  CompanyMembershipInvite,
  any,
  CompanyMembershipInvitesProvider.CreateMutationPayload
> {
  return useMutation((payload) => api.create({ ...props, data: payload }), {
    mutationKey: `${KEY} | Create`,
    retry: 0,
  });
}

// Decline
export function useDeclineCompanyMembershipInvite(
  props: CompanyMembershipInvitesProvider.POSTProps,
): UseMutationResult<
  CompanyMembershipInvite,
  any,
  CompanyMembershipInvitesProvider.DeclineMutationPayload
> {
  return useMutation((payload) => api.decline({ ...props, data: payload }), {
    mutationKey: `${KEY} | Decline`,
    retry: 0,
  });
}

// Delete
export function useDeleteCompanyMembershipInvite(
  props: CompanyMembershipInvitesProvider.POSTProps,
): UseMutationResult<
  null,
  any,
  CompanyMembershipInvitesProvider.DeleteMutationPayload
> {
  return useMutation((payload) => api.deleteItem({ ...props, data: payload }), {
    mutationKey: `${KEY} | Delete`,
    retry: 0,
  });
}
