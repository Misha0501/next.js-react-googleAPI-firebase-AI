import * as z from "zod";

export const companyMembershipInviteSchema = z.object({
  applicationUserEmailReceiver: z.string(),
  applicationUserRole: z.string(),
});
