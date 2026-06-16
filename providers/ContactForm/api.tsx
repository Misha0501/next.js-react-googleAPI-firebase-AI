import service from "@/services";
import { ContactFormProvider } from "@/providers/ContactForm/types";

export async function create(props: {
  data: ContactFormProvider.CreateMutationPayload;
}): Promise<null> {
  return service({
    method: "POST",
    url: `/api/contactForm`,
    body: props.data as Record<string, unknown>,
    parseJSON: false,
  });
}
