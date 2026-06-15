import {
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult,
} from "react-query";
import * as api from "./api";
import { SavedSearchesProvider } from "@/providers/SavedSearches/types";
import { SavedSearch } from "@/types";
import type { AuthProps } from "@/providers/types";

const KEY = "SavedSearches";

export function useSavedSearches(
  props: AuthProps,
): UseQueryResult<SavedSearchesProvider.ReadResponse> {
  return useQuery(`${KEY} | Items`, () => api.savedSearches(props), {
    enabled: !!props?.authToken,
    retry: 0,
  });
}

export function useCreateSavedSearches(
  props: AuthProps,
): UseMutationResult<
  SavedSearch,
  Error,
  SavedSearchesProvider.CreateMutationPayload
> {
  return useMutation((payload) => api.create({ ...props, data: payload }), {
    mutationKey: `${KEY} | Create`,
    retry: 0,
  });
}

export function useDeleteSavedSearch(
  props: AuthProps,
): UseMutationResult<null, Error, SavedSearchesProvider.DeleteMutationPayload> {
  return useMutation((payload) => api.deleteItem({ ...props, data: payload }), {
    mutationKey: `${KEY} | Delete`,
    retry: 0,
  });
}
