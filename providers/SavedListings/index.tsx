import {
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult,
} from "react-query";
import * as api from "./api";
import { SavedListingsProvider } from "@/providers/SavedListings/types";
import { SavedListing } from "@/types";

const KEY = "SavedListings";

// Saved listings results
export function useSavedListings(
  props: any,
): UseQueryResult<SavedListingsProvider.ReadResponse> {
  return useQuery(`${KEY} | Items`, () => api.savedListings(props), {
    retry: 0,
  });
}

// Create
export function useCreateSavedListing(
  props: any,
): UseMutationResult<
  SavedListing,
  any,
  SavedListingsProvider.CreateMutationPayload
> {
  return useMutation((payload) => api.create({ ...props, data: payload }), {
    mutationKey: `${KEY} | Create`,
    retry: 0,
  });
}

// Delete
export function useDeleteSavedListing(
  props: any,
): UseMutationResult<null, any, SavedListingsProvider.DeleteMutationPayload> {
  return useMutation((payload) => api.deleteItem({ ...props, data: payload }), {
    mutationKey: `${KEY} | Delete`,
    retry: 0,
  });
}
