import { useMutation, UseMutationResult } from "@tanstack/react-query";
import * as api from "@/providers/Companies/api";
import { Company } from "@/types";
import { CompanyProvider } from "@/providers/Companies/types";

const KEY = "Company";

// Create
export function useCreateCompany(): UseMutationResult<
  Company,
  CompanyProvider.ResponseError,
  CompanyProvider.CreateMutation
> {
  return useMutation<
    Company,
    CompanyProvider.ResponseError,
    CompanyProvider.CreateMutation
  >({
    mutationFn: (payload) => api.create({ data: payload }) as Promise<Company>,
    mutationKey: [KEY, "Create"],
    retry: 0,
  });
}

// Update
export function useUpdateCompany(): UseMutationResult<
  Company,
  CompanyProvider.ResponseError,
  CompanyProvider.UpdateMutation
> {
  return useMutation<
    Company,
    CompanyProvider.ResponseError,
    CompanyProvider.UpdateMutation
  >({
    mutationFn: (payload) => api.update({ data: payload }) as Promise<Company>,
    mutationKey: [KEY, "Update"],
    retry: 0,
  });
}
