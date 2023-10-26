import { prisma } from "@/app/lib/db/client";

export const getRecentlyViewedListings = async (userId: number): Promise<any> => {
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
          ListingPrice: true
        }
      }
    },
    where: {
      applicationUserId: userId,
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: 10
  });

  return { total: itemsCount, results: items };
};

export const handleRecentlyViewedCreation = async (userId: number, listingId: number): Promise<any> => {
  const createData = {
    applicationUserId: userId,
    listingId
  };

  const lastResult = await prisma.recentlyViewedListing.findFirst({
    where: {
      applicationUserId: userId,
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  if (lastResult && lastResult.listingId === listingId) {
    return lastResult;
  }

  return await prisma.recentlyViewedListing.create({ data: { ...createData } });
};
