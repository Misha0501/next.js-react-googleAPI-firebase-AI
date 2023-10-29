import {
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult,
} from "react-query";
import * as api from "./api";
import { SavedSearchesProvider } from "@/providers/SavedSearaches/types";
import { SavedSearch } from "@/types";

const KEY = "SavedSearches";

export function useSavedSearches(
  props: any,
): UseQueryResult<SavedSearchesProvider.ReadResponse> {
  return useQuery(`${KEY} | Items`, () => api.savedSearches(props), {
    retry: 0,
  });
}

export function useCreateSavedSearches(
  props: any,
): UseMutationResult<
  SavedSearch,
  any,
  SavedSearchesProvider.CreateMutationPayload
> {
  return useMutation((payload) => api.create({ ...props, data: payload }), {
    mutationKey: `${KEY} | Create`,
    retry: 0,
  });
}

export function useDeleteSavedSearch(
  props: any
): UseMutationResult<null, any, SavedSearchesProvider.DeleteMutationPayload>{
  return useMutation((payload) => api.deleteItem({ ...props, data: payload }), {
    mutationKey: `${KEY} | Delete`,
    retry: 0,
  });
}
