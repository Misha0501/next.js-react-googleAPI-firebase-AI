import { ResponseError } from "@/app/lib/classes/ResponseError";

/**
 * Validates a given slug to ensure it can be converted to a valid ID number.
 * If the slug cannot be converted to a number or is NaN, it throws a custom ResponseError.
 *
 * @param {number} slug - The slug (usually from a URL) to be validated and converted.
 * @returns {number} - The validated ID as a number.
 * @throws {ResponseError} - If the slug is not a valid number.
 */
export const validateParamId = (slug: number): number => {
  const id = Number(slug);
  if (isNaN(id)) throw new ResponseError("ID must be a valid number", 422);
  return id;
};
