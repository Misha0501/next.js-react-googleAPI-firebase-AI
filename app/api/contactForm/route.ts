import { ResponseError } from "@/classes/ResponseError";
import { contactFormSchema } from "@/app/lib/validations/contactForm";
import { NextResponse } from "next/server";
import { z } from "zod";
import { sendEmail } from "@/app/lib/email";

export const dynamic = "force-dynamic"; // Force dynamic (server) route instead of static page

export async function POST(req: Request) {
  try {
    const parsedValues = contactFormSchema.parse(await req.json());
    let { name, phoneNumber, email, message, emailTo, subject  } =
      parsedValues;

    // Assing emailTo to email if emailTo is not set
    emailTo = emailTo ? emailTo : "m.galenda5@gmail.com";

    // Assign subject to "Contact Form" if subject is not set
    subject = subject ? subject : "Contact Form";

    await sendEmail({
      to: emailTo,
      subject,
      html: `
            <h1>Hi there!</h1>
            <p>You have a new message from ${name}.</p>
            <p>Phone number: ${phoneNumber}</p>
            <p>Email: ${email}</p>
            <p>Subject: ${subject}</p>
            <p>Message:</p>
            <p>${message}</p>
          `
    });

    return NextResponse.json(parsedValues);
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }

    if (error instanceof ResponseError) {
      return new Response(error.message, { status: error.status });
    }

    return new Response("Something went wrong please try again later", {
      status: 500,
    });
  }
}
