import { useMutation } from "react-query";
import * as api from "./api";

const KEY = "Company";

// Create
export function useCreateCompany(
  props: any
) {
  // const queryClient = useQueryClient();
  return useMutation((payload) => api.create({ ...props, data: payload }), {
    mutationKey: `${KEY} | Create`,
    retry: 0
  });
}


export function useUpdateCompany(
  props: any
) {
  // const queryClient = useQueryClient();
  return useMutation((payload) => api.update({ ...props, data: payload }), {
    mutationKey: `${KEY} | Update`,
    retry: 0
  });
}