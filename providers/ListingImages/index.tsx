import { useMutation, UseMutationResult } from "react-query";
import * as api from "./api";
import { ListingsImagesProvider } from "@/providers/ListingImages/types";

const KEY = "ListingImages";

// Delete
export function useDeleteListingImage(
  props: any
): UseMutationResult<null, any, ListingsImagesProvider.DeleteMutationProps> {
  return useMutation((payload) => api.deleteItem({ ...props, data: payload }), {
    mutationKey: `${KEY} | Delete`,
    retry: 0
  });
}
