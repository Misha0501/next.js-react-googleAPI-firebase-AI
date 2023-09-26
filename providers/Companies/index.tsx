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
