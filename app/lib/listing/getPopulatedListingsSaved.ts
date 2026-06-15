import { Listing, SavedListing } from "@/types";

export const getPopulatedListingsSaved = (listings: Listing[], savedListings: SavedListing[]): Listing[] => {
    if (!listings || !listings.length) return [];
    if (!savedListings || !savedListings.length) return listings;

    const savedMap = new Map(savedListings.map((s) => [s.listingId, s]));

    return listings.map((listing) => {
        const saved = savedMap.get(listing.id);
        listing.savedListingId = saved?.id ?? undefined;
        return listing;
    });
};
