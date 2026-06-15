import { useMutation, UseMutationResult } from "react-query";
import * as api from "./api";
import { ListingsImagesProvider } from "@/providers/ListingImages/types";
import type { AuthProps } from "@/providers/types";

const KEY = "ListingImages";

// Delete
export function useDeleteListingImage(
  props: AuthProps,
): UseMutationResult<null, Error, ListingsImagesProvider.DeleteMutationProps> {
  return useMutation((payload) => api.deleteItem({ ...props, data: payload }), {
    mutationKey: `${KEY} | Delete`,
    retry: 0
  });
}
