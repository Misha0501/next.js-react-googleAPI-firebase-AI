import * as z from "zod";

export const companySchema = z.object({
  name: z.string(),
  description: z.string().optional().nullable(),
  phoneNumber: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  address: z
    .object({
      streetNumber: z.string().optional().nullable(),
      route: z.string().optional().nullable(),
      locality: z.string().optional().nullable(),
      postalCode: z.string().optional().nullable(),
      neighborhood: z.string().optional().nullable(),
      latitude: z.string().optional().nullable(),
      longitude: z.string().optional().nullable(),
      administrativeAreaLevelOne: z.string().optional().nullable(),
      showExactLocation: z.boolean().optional().nullable(),
    })
    .optional().nullable(),
});
