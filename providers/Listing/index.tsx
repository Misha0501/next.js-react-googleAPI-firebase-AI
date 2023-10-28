import {
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "react-query";
import * as api from "./api";
import { Poperty } from "./types";

const KEY = "PropertyListing";

export function getKeyFromProps(
  props: any,
  type: "LISTING" | "DETAIL"
): string[] {
  const key = [KEY, type];
  key.push(props);
  return key;
}

//Listing
export function usePropertyListing(
  props: Poperty.ListingProps
): UseQueryResult<any> {
  return useQuery(getKeyFromProps(props, "LISTING"), () => api.listing(props), {
    retry: 0,
  });
}

//ListingDetailPage
export function useListingDetailPage(
  props: Poperty.listingDetailPageProps
): UseQueryResult<Poperty.listingDetailPageResponse> {
  return useQuery(
    getKeyFromProps(props, "DETAIL"),
    () => api.listingDetailPage(props),
    {
      retry: 0,
    }
  );
}

// Create
export function useCreateProperty(
  props: Poperty.CreateProps
): UseMutationResult<
  Poperty.CreateResponse,
  null,
  Poperty.CreateMutationPayload
> {
  const queryClient = useQueryClient();
  return useMutation((payload) => api.create({ ...props, data: payload }), {
    mutationKey: `${KEY} | Create`,
    retry: 0,
  });
}

// Update
export function useUpdateProperty(
  props: Poperty.UpdatePropertyProp
): UseMutationResult<
  Poperty.UpdatePropertyResponse,
  null,
  Poperty.UpdatePropertyMutationPayload
> {
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
    }
  );
}

// Delete
export function useDeleteListing(
  props: any
){
  return useMutation((payload) => api.deleteItem({ ...props, data: payload }), {
    mutationKey: `${KEY} | Delete`,
    retry: 0
  });
}

