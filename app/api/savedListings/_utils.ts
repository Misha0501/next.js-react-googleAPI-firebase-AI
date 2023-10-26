import { prisma } from "@/app/lib/db/client";
import { ResponseError } from "@/app/lib/classes/ResponseError";

export const getSavedListings = async (userId: number): Promise<any> => {
  const savedListingsCount = await prisma.savedListing.count({
    where: {
      applicationUserId: userId,
    },
  });

  const savedListings = await prisma.savedListing.findMany({
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
  });

  return { total: savedListingsCount, results: savedListings };
};

export const handleSavedListingCreation = async (userId: number, listingId: number): Promise<any> => {
  const savedListingData = {
    applicationUserId: userId,
    listingId
  };

  const existingSavedListing = await prisma.savedListing.findMany({ where: { ...savedListingData } });

  if (!existingSavedListing || !existingSavedListing.length) {
    return await prisma.savedListing.create({ data: { ...savedListingData } });
  }

  return existingSavedListing[0];
};


export const fetchSavedListing = async (id: number): Promise<any> => {
  return await prisma.savedListing.findUnique({
    where: { id },
  });
};

export const validateUserAuthorization = (applicationUserId: number, savedListing: any): void => {
  if (applicationUserId !== savedListing.applicationUserId) {
    throw new ResponseError("You aren't allowed to change this property", 401);
  }
};

export const deleteSavedListing = async (id: number): Promise<void> => {
  await prisma.savedListing.delete({
    where: { id },
  });
};
