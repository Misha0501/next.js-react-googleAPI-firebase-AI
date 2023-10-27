import { prisma } from "@/app/lib/db/client";
import { ResponseError } from "@/app/lib/classes/ResponseError";

/**
 * Fetches the count of saved searches associated with a specific user.
 *
 * @param {number} applicationUserId - The ID of the application user.
 * @returns {Promise<number>} - The count of saved searches.
 */
export const fetchSavedSearchesCount = async (
  applicationUserId: number,
): Promise<number> => {
  return await prisma.savedSearch.count({
    where: {
      applicationUserId,
    },
  });
};

/**
 * Retrieves all saved searches associated with a specific user.
 *
 * @param {number} applicationUserId - The ID of the application user.
 * @returns {Promise<any[]>} - An array of saved search records.
 */
export const fetchSavedSearches = async (
  applicationUserId: number,
): Promise<any[]> => {
  return await prisma.savedSearch.findMany({
    where: {
      applicationUserId,
    },
  });
};

/**
 * Fetches a specific saved search by its ID.
 *
 * @param {number} id - The ID of the saved search.
 * @returns {Promise<any>} - The saved search record.
 */
export const fetchSavedSearch = async (id: number): Promise<any> => {
  return await prisma.savedSearch.findUnique({
    where: {
      id,
    },
  });
};

/**
 * Validates if a user is authorized to perform operations on a specific saved search.
 * Throws an error if the user is not authorized.
 *
 * @param {number} userId - The ID of the user attempting the operation.
 * @param {number} savedSearchUserId - The ID of the user associated with the saved search.
 * @throws {ResponseError} - Throws error if user is not authorized.
 */
export const authorizeUser = (
  userId: number,
  savedSearchUserId: number,
): void => {
  if (userId !== savedSearchUserId) {
    throw new ResponseError("You aren't allowed to change this property", 401);
  }
};

/**
 * Deletes a saved search based on its ID.
 *
 * @param {number} id - The ID of the saved search to be deleted.
 * @returns {Promise<void>}
 */
export const deleteSavedSearch = async (id: number): Promise<void> => {
  await prisma.savedSearch.delete({
    where: { id },
  });
};
