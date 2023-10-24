import { Listing, SavedListing } from "@/types";

/**
 * Returns a list of listings with savedListingId populated
 * @param listings List of listings
 * @param savedListings List of saved listings
 */
export const getPopulatedListingsSaved = (listings: Listing[], savedListings: SavedListing[]): Listing[] => {
    if(!listings || !listings.length) return [];
    if(!savedListings || !savedListings.length) return listings;

    let savedListingsListingIds: number[] = [];

    // Store all savedListing's listingIds
    if (savedListings) {
        savedListingsListingIds = savedListings.map((el) => el.listingId);
    }

    // populate listings with saved listings data
    const populatedListingsWithSavedListingData = listings.map((listing) => {
        const savedListingListingId = savedListingsListingIds.find(
          (savedListingId) => savedListingId === listing.id
        );
        const savedListing = savedListings.find(
          (savedListing: SavedListing) =>
            savedListing.listingId === savedListingListingId
        );

        if (savedListingListingId && savedListingListingId && savedListing) {
            listing.savedListingId = savedListing.id;
        } else {
            listing.savedListingId = undefined;
        }
        return listing;
    });

    return populatedListingsWithSavedListingData;
}
