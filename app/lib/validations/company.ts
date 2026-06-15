import * as z from "zod";
import { baseAddressSchema } from "@/app/lib/validations/shared";

export const companySchema = z.object({
  name: z.string(),
  description: z.string().optional().nullable(),
  phoneNumber: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  address: baseAddressSchema.optional().nullable(),
});

export const companyPUTSchema = z.object({
  id: z.number(),
  name: z.string().optional(),
  description: z.string().optional().nullable(),
  phoneNumber: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  address: baseAddressSchema.extend({ id: z.number() }).optional().nullable(),
});
