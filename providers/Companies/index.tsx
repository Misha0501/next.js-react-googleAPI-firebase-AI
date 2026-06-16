import { useMutation, UseMutationResult } from "react-query";
import * as api from "./api";
import { Company } from "@/types";
import { CompanyProvider } from "@/providers/Companies/types";
import type { AuthProps } from "@/providers/types";

const KEY = "Company";

// Create
export function useCreateCompany(
  props: AuthProps,
): UseMutationResult<
  Company,
  CompanyProvider.ResponseError,
  CompanyProvider.CreateMutation
> {
  return useMutation<
    Company,
    CompanyProvider.ResponseError,
    CompanyProvider.CreateMutation
  >((payload) => api.create({ ...props, data: payload }) as Promise<Company>, {
    mutationKey: `${KEY} | Create`,
    retry: 0,
  });
}

// Update
export function useUpdateCompany(
  props: AuthProps,
): UseMutationResult<
  Company,
  CompanyProvider.ResponseError,
  CompanyProvider.UpdateMutation
> {
  return useMutation<
    Company,
    CompanyProvider.ResponseError,
    CompanyProvider.UpdateMutation
  >((payload) => api.update({ ...props, data: payload }) as Promise<Company>, {
    mutationKey: `${KEY} | Update`,
    retry: 0,
  });
}
