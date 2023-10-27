import { prisma } from "@/app/lib/db/client";
import { Listing, MatchedListingsAndSearches, SavedSearch } from "@/types";
import { sendEmail } from "@/app/lib/email";

/**
 * Fetch saved searches including the application user.
 * @returns {Promise<any[]>} - Returns saved searches with application user.
 */
export const getSavedSearchesWithUser = async (): Promise<any[]> => {
  return await prisma.savedSearch.findMany({
    include: {
      applicationUser: true,
    },
  });
};

/**
 * Fetch listings created in the last 24 hours.
 * @returns {Promise<any[]>} - Returns listings from the last 24 hours with address.
 */
export const getListingsFromLastDay = async (): Promise<any[]> => {
  return await prisma.listing.findMany({
    where: {
      createdAt: {
        gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
      },
    },
    include: {
      Address: true,
    },
  });
};


/**
 * Matches listings to saved searches
 * @param savedSearches Saved searches to match listings to
 * @param listings Listings to match to saved searches
 */
export const getMatchedListingsAndSearches = (savedSearches: SavedSearch[], listings: Listing[]): MatchedListingsAndSearches[] => {
  // Results which consist of matched listings and saved searches
  let results: MatchedListingsAndSearches[] = []; //

  // Check if any of the listings match any of saved searches and send notification
  for (const element of listings) {
    const listing: Listing = element;

    const matchedSearches = savedSearches.filter((search: SavedSearch) => {
      return (
        (search.applicationUserId !== listing.applicationUserId) &&
        (!search.listingType || search.listingType === listing.listingType) &&
        (!search.locality || search.locality == listing.Address?.[0]?.locality) &&
        (!search.priceMax || search.priceMax >= listing.price) &&
        (!search.priceMin || search.priceMin <= listing.price) &&
        (!search.areaTotalMin || search.areaTotalMin <= listing.areaTotal) &&
        (!search.areaTotalMax || search.areaTotalMax >= listing.areaTotal) &&
        (!search.areaLivingMin || search.areaLivingMin <= listing.areaLiving) &&
        (!search.areaLivingMax || search.areaLivingMax >= listing.areaLiving) &&
        (!search.areaLandMin || search.areaLandMin <= listing.areaLand) &&
        (!search.areaLandMax || search.areaLandMax >= listing.areaLand) &&
        (!search.upkeepType || !search.upkeepType.length || search.upkeepType.includes(listing.upkeepType)) &&
        (!search.interiorType || !search.interiorType.length || search.interiorType.includes(listing.interiorType)) &&
        (!search.propertyType || !search.propertyType.length || search.propertyType.includes(listing.propertyType)) &&
        (!search.heatingType || !search.heatingType.length || search.heatingType.includes(listing.heatingType)) &&
        (!search.roomsMin || search.roomsMin <= listing.rooms) &&
        (!search.roomsMax || search.roomsMax >= listing.rooms) &&
        (!search.bedroomsMin || search.bedroomsMin <= listing.bedrooms) &&
        (!search.bedroomsMax || search.bedroomsMax >= listing.bedrooms) &&
        (!search.constructedYearMin || search.constructedYearMin <= listing.constructedYear) &&
        (!search.constructedYearMax || search.constructedYearMax >= listing.constructedYear) &&
        (!search.bathroomsMin || search.bathroomsMin <= listing.bathrooms) &&
        (!search.bathroomsMax || search.bathroomsMax >= listing.bathrooms) &&
        (!search.areaOutsideMin || search.areaOutsideMin <= listing.areaOutside) &&
        (!search.areaOutsideMax || search.areaOutsideMax >= listing.areaOutside) &&
        (!search.constructedYearMin || search.constructedYearMin <= listing.constructedYear) &&
        (!search.constructedYearMax || search.constructedYearMax >= listing.constructedYear)
      );
    });
    results.push({ listing, matchedSearches });
  }

  return results;
};

/**
 * Sends emails to users with matched listings/saved searches
 * @param matchedListingsAndSearches Matched listings and saved searches
 */
export const sendEmailsToMatchedListingsSearches = async (matchedListingsAndSearches: MatchedListingsAndSearches[]) => {
  // Send emails to users with matched listings/saved searches
  for (const element of matchedListingsAndSearches) {
    const matchedListing = element.listing;
    const matchedSearches = element.matchedSearches;

    for (const element of matchedSearches) {
      const matchedSearch = element;
      const applicationUser = matchedSearch.applicationUser;
      if(!applicationUser) continue;

      try {
        // Send email to user with matched listing and a link to the listing
        await sendEmail({
          to: applicationUser.email,
          subject: "A property is placed that matches your saved search!",
          html: `
            <h1>Hi there!</h1>
            <p>A property that matches your saved search has been posted!</p>
            <p>View the property via the below link:</p>
            <a href="http://localhost:3000/listings/${matchedListing.id}">View listing</a>
          `
        });

        // Save notification to the database
        await prisma.sentNotificationSavedSearch.create({
          data: {
            savedSearchId: matchedSearch.id,
            listingId: matchedListing.id
          }
        });
      } catch (error) {
        console.error(error);
      }
    }
  }
}
