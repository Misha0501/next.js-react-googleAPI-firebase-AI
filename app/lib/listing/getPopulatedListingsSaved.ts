import { Listing } from "@/types";

type SavedRef = { id: number; listingId: number };

export const getPopulatedListingsSaved = (
  listings: Listing[],
  savedRefs: SavedRef[],
): Listing[] => {
  if (!listings || !listings.length) return [];
  if (!savedRefs || !savedRefs.length) return listings;

  const savedMap = new Map(savedRefs.map((s) => [s.listingId, s.id]));

  return listings.map((listing) => ({
    ...listing,
    savedListingId: savedMap.get(listing.id),
  }));
};
