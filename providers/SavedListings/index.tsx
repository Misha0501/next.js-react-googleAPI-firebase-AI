import {
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult,
} from "@tanstack/react-query";
import * as api from "@/providers/SavedListings/api";
import { SavedListingsProvider } from "@/providers/SavedListings/types";
import { SavedListing } from "@/types";
import type { AuthProps } from "@/providers/types";

const KEY = "SavedListings";

export function useSavedListings(
  props: AuthProps & { page?: number },
): UseQueryResult<SavedListingsProvider.ReadResponse> {
  const page = props.page ?? 1;
  return useQuery({
    queryKey: [`${KEY} | Items`, page],
    queryFn: () => api.savedListings(props),
    enabled: !!props?.authToken,
    retry: 0,
  });
}

export function useSavedListingIds(
  props: AuthProps,
): UseQueryResult<{ id: number; listingId: number }[]> {
  return useQuery({
    queryKey: [`${KEY} | Ids`],
    queryFn: () => api.savedListingIds(props),
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
  return useMutation({
    mutationFn: (payload) => api.create({ ...props, data: payload }),
    mutationKey: [KEY, "Create"],
    retry: 0,
  });
}

export function useDeleteSavedListing(
  props: AuthProps,
): UseMutationResult<null, Error, SavedListingsProvider.DeleteMutationPayload> {
  return useMutation({
    mutationFn: (payload) => api.deleteItem({ ...props, data: payload }),
    mutationKey: [KEY, "Delete"],
    retry: 0,
  });
}
