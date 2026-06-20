import {
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import * as api from "@/providers/Listing/api";
import { ListingProvider } from "@/providers/Listing/types";
import { Listing } from "@/types";

const KEY = "PropertyListing";

export function getKeyFromProps(
  props: unknown,
  type: "LISTING" | "DETAIL",
): unknown[] {
  const key: unknown[] = [KEY, type];
  key.push(props);
  return key;
}

//Listing
export function usePropertyListing(
  props: ListingProvider.ListingsProps,
): UseQueryResult<ListingProvider.ListingsResponse> {
  return useQuery({
    queryKey: getKeyFromProps(props, "LISTING"),
    queryFn: () => api.listing(props),
    retry: 0,
  });
}

//ListingDetailPage
export function useListingDetailPage(
  props: ListingProvider.DetailProps,
): UseQueryResult<Listing, Error> {
  return useQuery({
    queryKey: getKeyFromProps(props, "DETAIL"),
    queryFn: () => api.listingDetailPage(props),
    retry: 0,
  });
}

// Create
export function useCreateProperty(): UseMutationResult<
  Listing,
  null,
  ListingProvider.CreateMutationPayload
> {
  return useMutation({
    mutationFn: (payload) => api.create({ data: payload }),
    mutationKey: [KEY, "Create"],
    retry: 0,
  });
}

// Update
export function useUpdateProperty(): UseMutationResult<
  Listing,
  Error,
  ListingProvider.UpdateMutationPayload
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => api.updateProperty({ data: payload }),
    mutationKey: [KEY, "Update"],
    retry: 0,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [KEY] });
    },
  });
}

// Delete
export function useDeleteListing(): UseMutationResult<
  null,
  Error,
  ListingProvider.DeleteProps["data"]
> {
  return useMutation({
    mutationFn: (payload) => api.deleteItem({ data: payload }),
    mutationKey: [KEY, "Delete"],
    retry: 0,
  });
}
