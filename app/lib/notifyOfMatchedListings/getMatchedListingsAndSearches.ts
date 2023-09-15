import { Listing, MatchedListingsAndSearches, SavedSearch } from "@/types";

export const getMatchedListingsAndSearches = (savedSearches, listings): MatchedListingsAndSearches => {
  // Results which consist of matched listings and saved searches
  let results: MatchedListingsAndSearches[] = []; //

  // Check if any of the listings match any of saved searches and send notification
  for (let i = 0; i < listings.length; i++) {
    const listing: Listing = listings[i];
    const matchedSearches = savedSearches.filter((search: SavedSearch) => {
      return (
        (search.applicationUserId !== listing.applicationUserId) &&
        (!search.listingType || search.listingType === listing.listingType) &&
        (!search.locality || search.locality === listing.Address[0].locality) &&
        (!search.priceMax || !search.priceMax >= listing.price) &&
        (!search.priceMin || !search.priceMin <= listing.price) &&
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
        (!search.listedSince || search.listedSince <= listing.createdAt) &&
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