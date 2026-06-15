import {
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult,
} from "react-query";
import * as api from "./api";
import { SavedListingsProvider } from "@/providers/SavedListings/types";
import { SavedListing } from "@/types";
import type { AuthProps } from "@/providers/types";

const KEY = "SavedListings";

export function useSavedListings(
  props: AuthProps,
): UseQueryResult<SavedListingsProvider.ReadResponse> {
  return useQuery(`${KEY} | Items`, () => api.savedListings(props), {
    enabled: !!props?.authToken,
    retry: 0,
  });
}

export function useCreateSavedListing(
  props: AuthProps,
): UseMutationResult<
  SavedListing,
  Error,
  SavedListingsProvider.CreateMutationPayload
> {
  return useMutation((payload) => api.create({ ...props, data: payload }), {
    mutationKey: `${KEY} | Create`,
    retry: 0,
  });
}

export function useDeleteSavedListing(
  props: AuthProps,
): UseMutationResult<null, Error, SavedListingsProvider.DeleteMutationPayload> {
  return useMutation((payload) => api.deleteItem({ ...props, data: payload }), {
    mutationKey: `${KEY} | Delete`,
    retry: 0,
  });
}
