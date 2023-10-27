import nodemailer, { SentMessageInfo } from "nodemailer";

type EmailPayload = {
  to: string;
  subject: string;
  html: string;
};

const smtpOptions = {
  host: process.env.SMTP_HOST || "smtp.mailtrap.io",
  port: parseInt(process.env.SMTP_PORT || "2525"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER || "user",
    pass: process.env.SMTP_PASSWORD || "password",
  },
};

/**
 * Sends an email with the given payload.
 *
 * @param {EmailPayload} data - The email payload.
 * @returns {Promise<SentMessageInfo>} - Resolves when the email is sent.
 * @throws Will throw an error if sending the email fails.
 */
export const sendEmail = async (
  data: EmailPayload,
): Promise<SentMessageInfo> => {
  const transporter = nodemailer.createTransport({
    ...smtpOptions,
  });

  return await transporter.sendMail({
    from: process.env.SMTP_FROM_EMAIL,
    ...data,
  });
};
