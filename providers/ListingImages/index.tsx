import { useMutation } from "react-query";
import * as api from "./api";

const KEY = "ListingImages";

// Delete
export function useDeleteListingImage(
  props: any
){
  return useMutation((payload) => api.deleteItem({ ...props, data: payload }), {
    mutationKey: `${KEY} | Delete`,
    retry: 0
  });
}
