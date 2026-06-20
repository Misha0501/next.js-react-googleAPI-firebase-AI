import { useMutation, UseMutationResult } from "@tanstack/react-query";
import * as api from "@/providers/ListingImages/api";
import { ListingsImagesProvider } from "@/providers/ListingImages/types";

const KEY = "ListingImages";

// Delete
export function useDeleteListingImage(): UseMutationResult<
  null,
  Error,
  ListingsImagesProvider.DeleteMutationProps
> {
  return useMutation<null, Error, ListingsImagesProvider.DeleteMutationProps>({
    mutationFn: (payload) => api.deleteItem({ data: payload }) as Promise<null>,
    mutationKey: [KEY, "Delete"],
    retry: 0,
  });
}

// Upload
export function useUploadListingImage(): UseMutationResult<
  ListingsImagesProvider.UploadResponse,
  Error,
  File
> {
  return useMutation<ListingsImagesProvider.UploadResponse, Error, File>({
    mutationFn: (file) => api.uploadImage(file),
    mutationKey: [KEY, "Upload"],
    retry: 0,
  });
}

// Delete by path (for images removed before the listing was ever saved)
export function useDeleteListingImageByPath(): UseMutationResult<
  null,
  Error,
  ListingsImagesProvider.DeleteByPathProps
> {
  return useMutation<null, Error, ListingsImagesProvider.DeleteByPathProps>({
    mutationFn: (payload) => api.deleteImageByPath(payload),
    mutationKey: [KEY, "DeleteByPath"],
    retry: 0,
  });
}
