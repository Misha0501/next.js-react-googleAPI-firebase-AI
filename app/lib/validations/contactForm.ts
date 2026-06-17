import * as z from "zod";

export const contactFormSchema = z.object({
  name: z.string().min(1),
  phoneNumber: z.string().optional(),
  email: z.string().email(),
  subject: z.string().optional(),
  emailTo: z.string().optional(),
  companyWebsite: z.string().optional(),
  message: z.string().min(1),
});
