import {
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult,
} from "@tanstack/react-query";
import * as api from "@/providers/SavedSearches/api";
import { SavedSearchesProvider } from "@/providers/SavedSearches/types";
import { SavedSearch } from "@/types";
import type { AuthProps } from "@/providers/types";

const KEY = "SavedSearches";

export function useSavedSearches(
  props: AuthProps & { page?: number },
): UseQueryResult<SavedSearchesProvider.ReadResponse> {
  const page = props.page ?? 1;
  return useQuery({
    queryKey: [`${KEY} | Items`, page],
    queryFn: () => api.savedSearches(props),
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
  return useMutation<
    SavedSearch,
    Error,
    SavedSearchesProvider.CreateMutationPayload
  >({
    mutationFn: (payload) =>
      api.create({ ...props, data: payload }) as Promise<SavedSearch>,
    mutationKey: [KEY, "Create"],
    retry: 0,
  });
}

export function useDeleteSavedSearch(
  props: AuthProps,
): UseMutationResult<null, Error, SavedSearchesProvider.DeleteMutationPayload> {
  return useMutation<null, Error, SavedSearchesProvider.DeleteMutationPayload>({
    mutationFn: (payload) =>
      api.deleteItem({ ...props, data: payload }) as Promise<null>,
    mutationKey: [KEY, "Delete"],
    retry: 0,
  });
}
