import { useMutation } from "react-query";
import * as api from "./api";

// Create
export function useSendEmail(props: any) {
  return useMutation((payload) => api.create({ ...props, data: payload }), {
    mutationKey: `Send Email`,
    retry: 0,
  });
}
