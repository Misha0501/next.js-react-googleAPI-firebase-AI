import * as z from "zod";

export const contactFormSchema = z.object({
  name: z.string().trim().min(1).max(120),
  phoneNumber: z.string().trim().max(40).optional(),
  email: z.string().trim().email().max(254),
  subject: z.string().trim().max(150).optional(),
  companyWebsite: z.string().optional(),
  message: z.string().trim().min(1).max(5000),
  targetType: z.enum(["LISTING", "USER", "COMPANY"]).optional(),
  targetId: z.number().int().positive().optional(),
}).superRefine((values, ctx) => {
  if (values.targetType && !values.targetId) {
    ctx.addIssue({
      code: "custom",
      path: ["targetId"],
      message: "Contact target id is required.",
    });
  }

  if (!values.targetType && values.targetId) {
    ctx.addIssue({
      code: "custom",
      path: ["targetType"],
      message: "Contact target type is required.",
    });
  }
});
