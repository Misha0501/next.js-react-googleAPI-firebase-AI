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
    enabled: !!props?.authToken,
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
  return useMutation<
    CompanyMembershipInvite,
    any,
    CompanyMembershipInvitesProvider.CreateMutationPayload
  >(
    (payload) =>
      api.create({
        ...props,
        data: payload,
      }) as Promise<CompanyMembershipInvite>,
    { mutationKey: `${KEY} | Create`, retry: 0 },
  );
}

// Decline
export function useDeclineCompanyMembershipInvite(
  props: CompanyMembershipInvitesProvider.POSTProps,
): UseMutationResult<
  CompanyMembershipInvite,
  any,
  CompanyMembershipInvitesProvider.DeclineMutationPayload
> {
  return useMutation<
    CompanyMembershipInvite,
    any,
    CompanyMembershipInvitesProvider.DeclineMutationPayload
  >(
    (payload) =>
      api.decline({
        ...props,
        data: payload,
      }) as Promise<CompanyMembershipInvite>,
    { mutationKey: `${KEY} | Decline`, retry: 0 },
  );
}

// Delete
export function useDeleteCompanyMembershipInvite(
  props: CompanyMembershipInvitesProvider.POSTProps,
): UseMutationResult<
  null,
  any,
  CompanyMembershipInvitesProvider.DeleteMutationPayload
> {
  return useMutation<
    null,
    any,
    CompanyMembershipInvitesProvider.DeleteMutationPayload
  >((payload) => api.deleteItem({ ...props, data: payload }) as Promise<null>, {
    mutationKey: `${KEY} | Delete`,
    retry: 0,
  });
}
