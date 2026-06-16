import { useMutation, UseMutationResult } from "react-query";
import * as api from "@/providers/ListingImages/api";
import { ListingsImagesProvider } from "@/providers/ListingImages/types";
import type { AuthProps } from "@/providers/types";

const KEY = "ListingImages";

// Delete
export function useDeleteListingImage(
  props: AuthProps,
): UseMutationResult<null, Error, ListingsImagesProvider.DeleteMutationProps> {
  return useMutation<null, Error, ListingsImagesProvider.DeleteMutationProps>(
    (payload) => api.deleteItem({ ...props, data: payload }) as Promise<null>,
    { mutationKey: `${KEY} | Delete`, retry: 0 },
  );
}
