import { useMutation, UseMutationResult } from "react-query";
import * as api from "./api";
import { ContactFormProvider } from "@/providers/ContactForm/types";

// Create
export function useSendEmail(
  props?: Record<string, never>,
): UseMutationResult<null, Error, ContactFormProvider.CreateMutationPayload> {
  return useMutation((payload) => api.create({ ...props, data: payload }), {
    mutationKey: `Send Email`,
    retry: 0,
  });
}
