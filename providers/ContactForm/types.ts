export namespace ContactFormProvider {
  export type CreateMutationPayload = {
    name: string;
    phoneNumber: string;
    email: string;
    message: string;
    emailTo?: string;
    subject?: string;
  }
}
