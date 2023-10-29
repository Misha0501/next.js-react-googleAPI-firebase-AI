import { useMutation, UseMutationResult } from "react-query";
import * as api from "./api";
import { ContactFormProvider } from "@/providers/ContactForm/types";

// Create
export function useSendEmail(
  props: any,
): UseMutationResult<null, any, ContactFormProvider.CreateMutationPayload> {
  return useMutation((payload) => api.create({ ...props, data: payload }), {
    mutationKey: `Send Email`,
    retry: 0,
  });
}
