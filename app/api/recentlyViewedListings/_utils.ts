import { prisma } from "@/app/lib/db/client";

/**
 * Fetches the recently viewed listings for a specific user.
 *
 * @param {number} userId - The ID of the user.
 * @returns {Promise<{total: number, results: any[]}>} - An object containing the total number of items and the actual listing items (up to 10).
 */
export const getRecentlyViewedListings = async (
  userId: number,
): Promise<any> => {
  const itemsCount = await prisma.recentlyViewedListing.count({
    where: {
      applicationUserId: userId,
    },
  });

  const items = await prisma.recentlyViewedListing.findMany({
    include: {
      listing: {
        include: {
          ListingImage: true,
          Address: true,
          ListingPrice: true,
        },
      },
    },
    where: {
      applicationUserId: userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
  });

  return { total: itemsCount, results: items };
};

/**
 * Handles the creation or retrieval of a recently viewed listing record for a user.
 * If the listing was already recently viewed by the user, the existing record is returned.
 * Otherwise, a new record is created.
 *
 * @param {number} userId - The ID of the user.
 * @param {number} listingId - The ID of the listing.
 * @returns {Promise<any>} - The recently viewed listing record.
 */
export const handleRecentlyViewedCreation = async (
  userId: number,
  listingId: number,
): Promise<any> => {
  const createData = {
    applicationUserId: userId,
    listingId,
  };

  const lastResult = await prisma.recentlyViewedListing.findFirst({
    where: {
      applicationUserId: userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (lastResult && lastResult.listingId === listingId) {
    return lastResult;
  }

  return await prisma.recentlyViewedListing.create({ data: { ...createData } });
};
