import { useMutation, useQuery, UseQueryResult } from "react-query";
import * as api from "./api";
import { CompanyMembershipInvite } from "@/types";

const KEY = "CompanyMembershipInvites";

export function useCompanyMembershipInvites(
  props: any
): UseQueryResult<CompanyMembershipInvite[], any> {
  return useQuery(`${KEY} | Items`, () => api.companyMembershipInvites(props), {
    retry: 0
  });
}

// Create
export function useCreateCompanyMembershipInvites(
  props: any
){
  return useMutation((payload) => api.create({ ...props, data: payload }), {
    mutationKey: `${KEY} | Create`,
    retry: 0
  });
}

// Decline
export function useDeclineCompanyMembershipInvite(
  props: any
){
  return useMutation((payload) => api.decline({ ...props, data: payload }), {
    mutationKey: `${KEY} | Decline`,
    retry: 0
  });
}

// Delete
export function useDeleteCompanyMembershipInvite(
  props: any
){
  return useMutation((payload) => api.deleteItem({ ...props, data: payload }), {
    mutationKey: `${KEY} | Delete`,
    retry: 0
  });
}

