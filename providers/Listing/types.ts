export namespace Poperty {
  export type ListingProps = {
    propertyTypeId?: string | null;
    areaTotalMin?: string | number | null;
    areaTotalMax?: string | number | null;
    areaLivingMin?: string | number | null;
    areaLivingMax?: string | number | null;
    areaLandMin?: string | number | null;
    areaLandMax?: string | number | null;
    roomsMin?: string | number | null;
    roomsMax?: string | number | null;
    bedroomsMin?: string | number | null;
    bedroomsMax?: string | number | null;
    listedSince?: string | number | null;
    constructedYearMin?: string | number | null;
    constructedYearMax?: string | number | null;
    priceMin?: string | number | null;
    priceMax?: string | number | null;
    listingType?: string | null;
    localty?: string | null;
    sortBy?: string | null;
  };
  export interface ListingAPIPayload extends ListingProps {}

  //Detail Page
  interface ListingImage {
    id: number;
    listingId: number;
    positionInListing: number;
    url: string;
    createdAt: string;
    updatedAt: string;
  }

  interface Address {
    id: number;
    streetNumber: string;
    route: string;
    administrativeAreaLevelOne: string | null;
    locality: string;
    postalCode: string;
    neighborhood: string;
    latitude: string;
    longitude: string;
    showExactLocation: boolean;
    createdAt: string;
    updatedAt: string;
    listingId: number;
    companyId: number | null;
  }

  interface ListingPrice {
    id: number;
    listingId: number | string;
    currency: string;
    tax: number | null;
    price: number;
    updatedListingPriceId: number | null;
    createdAt: string;
    updatedAt: string;
  }

  export type listingDetailPageProps = {
    id: number;
  };
  export type listingDetailPageResponse = {
    id: number;
    applicationUserId: number;
    companyId: number | null;
    listingType: string;
    interiorType: string;
    upkeepType: string;
    propertyType: string;
    description: string;
    price: number;
    currency: string;
    areaTotal: string | number | null;
    areaLiving: string | number | null;
    areaLand: number;
    volume: number | string;
    areaOutside: string | number | null;
    areaGarage: number | string;
    rooms: number | string | null;
    bathrooms: number | string | null;
    bedrooms: number | string | null;
    parking: string;
    constructedYear: string;
    floorNumber: number | string;
    numberOfFloorsProperty: number;
    numberOfFloorsCommon: number;
    heatingType: string;
    active: boolean | null;
    activeUntil: string | null;
    createdAt: string;
    updatedAt: string;
    deleted: boolean | null;
    ListingImage: ListingImage[];
    Address: Address[];
    ListingPrice: ListingPrice[];
    buildingType?: string | number;
    areaGarden?: string | number;
    balcony?: string;
  };
  export interface listingDetailPageAPIPayload extends listingDetailPageProps {}
}
