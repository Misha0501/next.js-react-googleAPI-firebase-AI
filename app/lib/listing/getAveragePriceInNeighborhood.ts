import { Listing } from "@/types";
import { prisma } from "@/app/lib/db/client";

export const getAveragePriceInNeighborhood = async (
  listing: Listing,
  excludeCurrentListing: boolean = false,
): Promise<number | null> => {
  try {
    const neighborhood = listing.Address?.[0]?.neighborhood;
    if (!neighborhood) return null;

    const listings = await prisma.listing.findMany({
      where: {
        deleted: null,
        propertyType: listing.propertyType,
        listingType: listing.listingType,
        ...(excludeCurrentListing ? { NOT: { id: listing.id } } : {}),
        Address: { some: { neighborhood } },
      },
      select: {
        id: true,
        ListingPrice: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: { price: true },
        },
      },
    });

    if (!listings || listings.length <= 1) return null;

    const prices: number[] = listings
      .map(
        (l: { ListingPrice: { price: number | null }[] }) =>
          l.ListingPrice[0]?.price,
      )
      .filter((p: number | null | undefined): p is number => p != null);

    if (prices.length === 0) return null;

    const average =
      prices.reduce((acc: number, p: number) => acc + p, 0) / prices.length;
    return Math.round(average * 100) / 100;
  } catch (error) {
    console.error(error);
    return null;
  }
};
