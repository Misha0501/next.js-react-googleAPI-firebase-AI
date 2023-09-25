import * as z from "zod";

export const companySchema = z.object({
  name: z.string(),
  description: z.string().optional().nullable(),
  phoneNumber: z.string().optional().nullable(),
  address: z
    .object({
      streetNumber: z.string().optional(),
      route: z.string().optional(),
      locality: z.string().optional(),
      postalCode: z.string().optional(),
      neighborhood: z.string().optional(),
      latitude: z.string().optional(),
      longitude: z.string().optional(),
      administrativeAreaLevelOne: z.string().optional(),
      showExactLocation: z.boolean().optional(),
    })
    .optional().nullable(),
});
