export namespace ContactFormProvider {
  export type ContactTargetType = "LISTING" | "USER" | "COMPANY";

  export type CreateMutationPayload = {
    name: string;
    phoneNumber: string;
    email: string;
    companyWebsite?: string;
    message: string;
    subject?: string;
    targetType?: ContactTargetType;
    targetId?: number;
  };
}
