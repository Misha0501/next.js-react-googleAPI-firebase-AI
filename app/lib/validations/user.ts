import * as z from "zod";

export const userPUTSchema = z.object({
  displayName: z.string().optional(),
  phoneNumber: z.string().optional(),
  newPassword: z.string().optional(),
});
