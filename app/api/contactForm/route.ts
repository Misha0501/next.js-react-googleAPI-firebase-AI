import { contactFormSchema } from "@/app/lib/validations/contactForm";
import { NextResponse } from "next/server";
import { sendEmail } from "@/app/lib/email";
import { handleAPIError } from "@/app/lib/api/handleError";
import {
  createEmailHTMLContent,
  getDefaultEmailTo,
  getDefaultSubject,
} from "@/app/api/contactForm/_utils";

export const dynamic = "force-dynamic"; // Force dynamic (server) route instead of static page

export async function POST(req: Request) {
  try {
    const parsedValues = contactFormSchema.parse(await req.json());
    let { name, phoneNumber, email, message, emailTo, subject } =
      parsedValues;

    emailTo = getDefaultEmailTo(emailTo);
    subject = getDefaultSubject(subject);
    
    const emailContent = createEmailHTMLContent(name, phoneNumber, email, subject, message);

    // Send email
    await sendEmail({
      to: emailTo,
      subject,
      html: emailContent
    });

    return NextResponse.json(parsedValues);
  } catch (error) {
    return handleAPIError(error);
  }
}
