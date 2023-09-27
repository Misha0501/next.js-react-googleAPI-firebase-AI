import { Listing } from "@/types";
import { prisma } from "@/app/lib/db/client";

/**
 * Get average price in neighborhood
 * @param listing Listing
 * @param excludeCurrentListing boolean
 * @returns number | null
 */
export const getAveragePriceInNeighborhood = async (
  listing: Listing,
  excludeCurrentListing: boolean = false,
) => {
  try {
    // Get listing's neighborhood from address
    const neighborhood = listing.Address?.[0]?.neighborhood;

    if (!neighborhood) return null;

    // Get all listings in the same neighborhood with the same property type
    let listingsInNeighborhood: Listing[] = await prisma.listing.findMany({
      where: {
        deleted: null,
        propertyType: listing.propertyType,
        Address: {
          some: {
            neighborhood,
          },
        },
      },
      include: {
        ListingPrice: true,
      },
    });

    if (excludeCurrentListing) {
      // exclude current listing from listingsInNeighborhood
      listingsInNeighborhood = listingsInNeighborhood.filter(
        (listingInNeighborhood) => listingInNeighborhood.id !== listing.id,
      );
    }

    // Get average price of listings in the same neighborhood
    const averagePrice =
      listingsInNeighborhood.reduce((acc, listing) => {
        return acc + listing.ListingPrice[0].price;
      }, 0) / listingsInNeighborhood.length;

    // Round average price to 2 decimal places
    return Math.round(averagePrice * 100) / 100;
  } catch (error) {
    console.error(error);
    return null;
  }
};
