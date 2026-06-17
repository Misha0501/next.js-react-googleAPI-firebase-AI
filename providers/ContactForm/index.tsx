import { useMutation, UseMutationResult } from "@tanstack/react-query";
import * as api from "@/providers/ContactForm/api";
import { ContactFormProvider } from "@/providers/ContactForm/types";

// Create
export function useSendEmail(
  props?: Record<string, never>,
): UseMutationResult<null, Error, ContactFormProvider.CreateMutationPayload> {
  return useMutation<null, Error, ContactFormProvider.CreateMutationPayload>({
    mutationFn: (payload) =>
      api.create({ ...props, data: payload }) as Promise<null>,
    mutationKey: ["Send Email"],
    retry: 0,
  });
}
