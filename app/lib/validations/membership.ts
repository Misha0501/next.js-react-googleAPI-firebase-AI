import * as z from "zod";

export const membershipSchema = z.object({
  companyMembershipInviteId: z.number(),
});
