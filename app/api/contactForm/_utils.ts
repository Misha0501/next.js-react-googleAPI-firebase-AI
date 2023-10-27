/**
 * Gets the default email address if none is provided.
 * @param {string | undefined} emailTo - The provided email address.
 * @returns {string} - Returns the email address or a default one if none is provided.
 */
export const getDefaultEmailTo = (emailTo?: string): string => {
  return emailTo ? emailTo : "m.galenda5@gmail.com";
};

/**
 * Gets the default subject if none is provided.
 * @param {string | undefined} subject - The provided subject.
 * @returns {string} - Returns the subject or a default one if none is provided.
 */
export const getDefaultSubject = (subject?: string): string => {
  return subject ? subject : "Contact Form";
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
  return `
        <h1>Hi there!</h1>
        <p>You have a new message from ${name}.</p>
        <p>Phone number: ${phoneNumber ?? "-"}</p>
        <p>Email: ${email}</p>
        <p>Subject: ${subject}</p>
        <p>Message:</p>
        <p>${message}</p>
    `;
};
