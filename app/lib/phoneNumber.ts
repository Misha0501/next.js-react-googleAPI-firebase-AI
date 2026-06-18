export const normalizeContactPhoneNumber = (
  phoneNumber: string | null | undefined,
): string | null | undefined => {
  if (phoneNumber === undefined) return undefined;
  if (phoneNumber === null) return null;

  const trimmedPhoneNumber = phoneNumber.trim();
  return trimmedPhoneNumber || null;
};
