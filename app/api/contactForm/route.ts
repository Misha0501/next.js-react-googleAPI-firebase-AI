import { contactFormSchema } from "@/app/lib/validations/contactForm";
import { NextResponse } from "next/server";
import { sendEmail } from "@/app/lib/email";
import { handleAPIError } from "@/app/lib/api/handleError";
import { checkRateLimit } from "@/app/lib/redis/rateLimit";
import { assertSameOrigin } from "@/app/lib/auth/origin";
import {
  createEmailHTMLContent,
  getClientIp,
  getContactEmailTo,
  getDefaultSubject,
} from "@/app/api/contactForm/_utils";

export const dynamic = "force-dynamic"; // Force dynamic (server) route instead of static page

export async function POST(req: Request) {
  try {
    await assertSameOrigin(req);

    const ip = getClientIp(req);
    if (!(await checkRateLimit(`rate:contact:${ip}`, 5, 60))) {
      return new Response("Too many requests", { status: 429 });
    }

    const parsedValues = contactFormSchema.parse(await req.json());
    const {
      name,
      phoneNumber,
      email,
      message,
      companyWebsite,
      targetType,
      targetId,
    } = parsedValues;

    if (companyWebsite) {
      return NextResponse.json({ ok: true });
    }

    const emailTo = await getContactEmailTo(targetType, targetId);
    const subject = getDefaultSubject(parsedValues.subject);

    const emailContent = createEmailHTMLContent(
      name,
      phoneNumber,
      email,
      subject,
      message,
    );

    // Send email
    await sendEmail({
      to: emailTo,
      subject,
      html: emailContent,
    });

    return NextResponse.json(parsedValues);
  } catch (error) {
    return handleAPIError(error);
  }
}
