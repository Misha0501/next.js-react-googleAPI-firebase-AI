import { prisma } from "@/app/lib/db/client";
import { Listing } from "@/types";
import { getAveragePriceInNeighborhood } from "@/app/lib/listing/getAveragePriceInNeighborhood";

export const getListingDetailById = async (
  id: number,
): Promise<(Listing & { averagePriceInNeighborhood: number | null }) | null> => {
  const listing = await prisma.listing.findUnique({
    where: {
      id,
      deleted: null,
    },
    include: {
      applicationUser: true,
      company: true,
      ListingImage: true,
      Address: true,
      ListingPrice: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  if (!listing) return null;

  const averagePriceInNeighborhood = await getAveragePriceInNeighborhood(
    listing as Listing,
  );

  return { ...listing, averagePriceInNeighborhood } as Listing & {
    averagePriceInNeighborhood: number | null;
  };
};
