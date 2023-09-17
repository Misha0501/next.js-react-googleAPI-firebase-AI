import { Listing, MatchedListingsAndSearches, SavedSearch } from "@/types";

export const getMatchedListingsAndSearches = (savedSearches, listings): MatchedListingsAndSearches => {
  // Results which consist of matched listings and saved searches
  let results: MatchedListingsAndSearches[] = []; //

  // Check if any of the listings match any of saved searches and send notification
  for (let i = 0; i < listings.length; i++) {
    const listing: Listing = listings[i];

    const matchedSearches = savedSearches.filter((search: SavedSearch) => {
      if(listing.id === 36 ) {
        console.log('listing', listing);
        console.log('search', search);
        console.log(
          (search.applicationUserId !== listing.applicationUserId) + '(search.applicationUserId !== listing.applicationUserId) \n' +
          (!search.listingType || search.listingType === listing.listingType) + '(!search.listingType || search.listingType === listing.listingType) \n' +
          (!search.locality || search.locality == listing.Address?.[0]?.locality) + '(!search.locality || search.locality == listing.Address?.[0]?.locality) \n' +
          (!search.priceMax || search.priceMax >= listing.price) + '(!search.priceMax || search.priceMax >= listing.price) \n' +
          (!search.priceMin || search.priceMin <= listing.price) + '(!search.priceMin || search.priceMin <= listing.price) \n' +
          (!search.areaTotalMin || search.areaTotalMin <= listing.areaTotal) + '(!search.areaTotalMin || search.areaTotalMin <= listing.areaTotal) \n' +
          (!search.areaTotalMax || search.areaTotalMax >= listing.areaTotal) + '(!search.areaTotalMax || search.areaTotalMax >= listing.areaTotal) \n' +
          (!search.areaLivingMin || search.areaLivingMin <= listing.areaLiving) + '(!search.areaLivingMin || search.areaLivingMin <= listing.areaLiving) \n' +
          (!search.areaLivingMax || search.areaLivingMax >= listing.areaLiving) + '(!search.areaLivingMax || search.areaLivingMax >= listing.areaLiving) \n' +
          (!search.areaLandMin || search.areaLandMin <= listing.areaLand) + '(!search.areaLandMin || search.areaLandMin <= listing.areaLand) \n' +
          (!search.areaLandMax || search.areaLandMax >= listing.areaLand) + '(!search.areaLandMax || search.areaLandMax >= listing.areaLand) \n' +
          (!search.upkeepType || !search.upkeepType.length || search.upkeepType.length || search.upkeepType.includes(listing.upkeepType)) + '(!search.upkeepType || search.upkeepType.length || search.upkeepType.includes(listing.upkeepType)) \n' +
          (!search.interiorType || !search.interiorType.length || search.interiorType.includes(listing.interiorType)) + '(!search.interiorType || search.interiorType.length || search.interiorType.includes(listing.interiorType)) \n' +
          (!search.propertyType || !search.propertyType.length || search.propertyType.includes(listing.propertyType)) + '(!search.propertyType || search.propertyType.length || search.propertyType.includes(listing.propertyType)) \n' +
          (!search.heatingType || !search.heatingType.length || search.heatingType.includes(listing.heatingType)) + '(!search.heatingType || search.heatingType.length || search.heatingType.includes(listing.heatingType)) \n' +
          (!search.roomsMin || search.roomsMin <= listing.rooms) + '(!search.roomsMin || search.roomsMin <= listing.rooms) \n' +
          (!search.roomsMax || search.roomsMax >= listing.rooms) + '(!search.roomsMax || search.roomsMax >= listing.rooms) \n' +
          (!search.bedroomsMin || search.bedroomsMin <= listing.bedrooms) + '(!search.bedroomsMin || search.bedroomsMin <= listing.bedrooms) \n' +
          (!search.bedroomsMax || search.bedroomsMax >= listing.bedrooms) + '(!search.bedroomsMax || search.bedroomsMax >= listing.bedrooms) \n' +
          (!search.constructedYearMin || search.constructedYearMin <= listing.constructedYear) + '(!search.constructedYearMin || search.constructedYearMin <= listing.constructedYear) \n' +
          (!search.constructedYearMax || search.constructedYearMax >= listing.constructedYear) + '(!search.constructedYearMax || search.constructedYearMax >= listing.constructedYear) \n' +
          (!search.listedSince || search.listedSince <= listing.createdAt) + '(!search.listedSince || search.listedSince <= listing.createdAt) \n' +
          (!search.bathroomsMin || search.bathroomsMin <= listing.bathrooms) + '(!search.bathroomsMin || search.bathroomsMin <= listing.bathrooms) \n' +
          (!search.bathroomsMax || search.bathroomsMax >= listing.bathrooms) + '(!search.bathroomsMax || search.bathroomsMax >= listing.bathrooms) \n' +
          (!search.areaOutsideMin || search.areaOutsideMin <= listing.areaOutside) + '(!search.areaOutsideMin || search.areaOutsideMin <= listing.areaOutside) \n' +
          (!search.areaOutsideMax || search.areaOutsideMax >= listing.areaOutside) + '(!search.areaOutsideMax || search.areaOutsideMax >= listing.areaOutside) \n' +
          (!search.constructedYearMin || search.constructedYearMin <= listing.constructedYear) + '(!search.constructedYearMin || search.constructedYearMin <= listing.constructedYear) \n' +
          (!search.constructedYearMax || search.constructedYearMax >= listing.constructedYear) + '(!search.constructedYearMax || search.constructedYearMax >= listing.constructedYear) '
        );
      }


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