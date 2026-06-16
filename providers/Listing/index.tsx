import {
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "react-query";
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
  return useQuery(getKeyFromProps(props, "LISTING"), () => api.listing(props), {
    retry: 0,
  });
}

//ListingDetailPage
export function useListingDetailPage(
  props: ListingProvider.DetailProps,
): UseQueryResult<Listing, Error> {
  return useQuery(
    getKeyFromProps(props, "DETAIL"),
    () => api.listingDetailPage(props),
    {
      retry: 0,
    },
  );
}

// Create
export function useCreateProperty(
  props: ListingProvider.CreateProps,
): UseMutationResult<Listing, null, ListingProvider.CreateMutationPayload> {
  return useMutation((payload) => api.create({ ...props, data: payload }), {
    mutationKey: `${KEY} | Create`,
    retry: 0,
  });
}

// Update
export function useUpdateProperty(
  props: ListingProvider.UpdatePropertyProp,
): UseMutationResult<Listing, Error, Listing> {
  const queryClient = useQueryClient();
  return useMutation(
    (payload) => api.updateProperty({ ...props, data: payload }),
    {
      mutationKey: `${KEY} | Update`,
      retry: 0,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getKeyFromProps(props, "DETAIL"),
        });
        queryClient.invalidateQueries(KEY);
      },
    },
  );
}

// Delete
export function useDeleteListing(
  props: ListingProvider.UpdatePropertyProp,
): UseMutationResult<null, Error, ListingProvider.DeleteProps["data"]> {
  return useMutation((payload) => api.deleteItem({ ...props, data: payload }), {
    mutationKey: `${KEY} | Delete`,
    retry: 0,
  });
}
