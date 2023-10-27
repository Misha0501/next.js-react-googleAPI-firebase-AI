import { prisma } from "@/app/lib/db/client";
import { ResponseError } from "@/app/lib/classes/ResponseError";

export const fetchSavedSearchesCount = async (
  applicationUserId: number,
): Promise<number> => {
  return await prisma.savedSearch.count({
    where: {
      applicationUserId,
    },
  });
};

export const fetchSavedSearches = async (
  applicationUserId: number,
): Promise<any[]> => {
  return await prisma.savedSearch.findMany({
    where: {
      applicationUserId,
    },
  });
};

export const fetchSavedSearch = async (id: number): Promise<any> => {
  return await prisma.savedSearch.findUnique({
    where: {
      id,
    },
  });
};

export const authorizeUser = (
  userId: number,
  savedSearchUserId: number,
): void => {
  if (userId !== savedSearchUserId) {
    throw new ResponseError("You aren't allowed to change this property", 401);
  }
};

export const deleteSavedSearch = async (id: number): Promise<void> => {
  await prisma.savedSearch.delete({
    where: { id },
  });
};
