import { Resend } from "resend";

type EmailPayload = {
  to: string | string[];
  subject: string;
  html: string;
};

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (data: EmailPayload): Promise<void> => {
  const { error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || "contact@homfli.com",
    ...data,
  });

  if (error) {
    throw new Error(error.message);
  }
};
