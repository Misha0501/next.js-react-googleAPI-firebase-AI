import { prisma } from "@/app/lib/db/client";
import { ResponseError } from "@/app/lib/classes/ResponseError";

type ContactTargetType = "LISTING" | "USER" | "COMPANY";

/**
 * Gets the default Homfli contact recipients.
 * @returns {string[]} - Default contact recipients.
 */
export const getDefaultEmailTo = (): string[] => {
  return ["contact@homfli.com", "misha.galenda@gmail.com"];
};

/**
 * Gets the default subject if none is provided.
 * @param {string | undefined} subject - The provided subject.
 * @returns {string} - Returns the subject or a default one if none is provided.
 */
export const getDefaultSubject = (subject?: string): string => {
  return subject ? subject.replace(/[\r\n]+/g, " ").trim() : "Contact Form";
};

const getContactEmailForListing = async (listingId: number): Promise<string> => {
  const listing = await prisma.listing.findUnique({
    where: { id: listingId, deleted: null },
    select: {
      applicationUser: { select: { email: true } },
      company: { select: { email: true } },
    },
  });

  const recipient = listing?.company?.email || listing?.applicationUser?.email;

  if (!recipient) {
    throw new ResponseError("Contact recipient was not found.", 404);
  }

  return recipient;
};

const getContactEmailForUser = async (userId: number): Promise<string> => {
  const applicationUser = await prisma.applicationUser.findUnique({
    where: { id: userId },
    select: { email: true },
  });

  if (!applicationUser?.email) {
    throw new ResponseError("Contact recipient was not found.", 404);
  }

  return applicationUser.email;
};

const getContactEmailForCompany = async (companyId: number): Promise<string> => {
  const company = await prisma.company.findUnique({
    where: { id: companyId },
    select: { email: true },
  });

  if (!company?.email) {
    throw new ResponseError("Contact recipient was not found.", 404);
  }

  return company.email;
};

export const getContactEmailTo = async (
  targetType?: ContactTargetType,
  targetId?: number,
): Promise<string | string[]> => {
  if (!targetType || !targetId) {
    return getDefaultEmailTo();
  }

  switch (targetType) {
    case "LISTING":
      return getContactEmailForListing(targetId);
    case "USER":
      return getContactEmailForUser(targetId);
    case "COMPANY":
      return getContactEmailForCompany(targetId);
  }
};

const escapeHtml = (value: string): string => {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

/**
 * Creates the HTML content for the email.
 * @param {string} name - The name of the sender.
 * @param {string} phoneNumber - The phone number of the sender.
 * @param {string} email - The email of the sender.
 * @param {string} subject - The subject of the email.
 * @param {string} message - The message content.
 * @returns {string} - Returns the HTML content for the email.
 */
export const createEmailHTMLContent = (
  name: string,
  phoneNumber: string | undefined,
  email: string,
  subject: string,
  message: string,
): string => {
  const safeName = escapeHtml(name);
  const safePhoneNumber = escapeHtml(phoneNumber ?? "-");
  const safeEmail = escapeHtml(email);
  const safeSubject = escapeHtml(subject);
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br />");

  return `
        <h1>Hi there!</h1>
        <p>You have a new message from ${safeName}.</p>
        <p>Phone number: ${safePhoneNumber}</p>
        <p>Email: ${safeEmail}</p>
        <p>Subject: ${safeSubject}</p>
        <p>Message:</p>
        <p>${safeMessage}</p>
    `;
};

export const getClientIp = (request: Request): string => {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");

  return forwardedFor?.split(",")[0]?.trim() || realIp || "unknown";
};
