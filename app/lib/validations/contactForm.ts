import * as z from "zod";

export const contactFormSchema = z.object({
  name: z.string(),
  phoneNumber: z.string().optional(),
  email: z.string(),
  subject: z.string().optional(),
  emailTo: z.string().optional(),
  message: z.string(),
});
