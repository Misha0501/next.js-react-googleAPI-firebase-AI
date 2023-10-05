import { useMutation, useQuery } from "react-query";
import * as api from "./api";

const KEY = "SavedSearches";

export function useSavedSearches(
  props: any
) {
  return useQuery(`${KEY} | Items`, () => api.savedSearches(props), {
    retry: 0
  });
}

export function useCreateSavedSearches(
  props: any
){
  // const queryClient = useQueryClient();
  return useMutation((payload) => api.create({ ...props, data: payload }), {
    mutationKey: `${KEY} | Create`,
    retry: 0
  });
}

export function useDeleteSavedSearch(
  props: any
){
  return useMutation((payload) => api.deleteItem({ ...props, data: payload }), {
    mutationKey: `${KEY} | Delete`,
    retry: 0
  });
}
