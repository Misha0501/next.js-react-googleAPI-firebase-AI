import * as z from "zod";
import { COMPANY_MEMBERSHIP_ROLE } from "@/app/lib/constants";
import type { CompanyMembershipRoleType } from "@/types";

export const companyMembershipInviteSchema = z.object({
  applicationUserEmailReceiver: z.string().trim().email(),
  applicationUserRole: z.enum(
    COMPANY_MEMBERSHIP_ROLE as [
      CompanyMembershipRoleType,
      ...CompanyMembershipRoleType[],
    ],
  ),
});
