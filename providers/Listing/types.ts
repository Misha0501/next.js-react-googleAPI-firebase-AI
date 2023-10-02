import { ApplicationUser, Company } from "@/types";

export namespace Poperty {
  export type ListingProps = {
    propertyType?: string[] | null;
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
    locality?: string | null;
    sortBy?: string | null;
  };
  export interface ListingAPIPayload extends ListingProps {}

  export type CreateProps = {};
  export type CreateResponse = {};

  export type CreateMutationPayload = {
    listingType: string | null;
    streetNumber?: number | string;
    interiorType: string | null;
    propertyType: string | null;
    currency: string;
    price: number | string;
    rooms?: number | null | string;
    bathrooms?: number | null | string;
    bedrooms?: number | null | string;
    parking?: number | null | string;
    floorNumber?: number | null | string;
    numberOfFloorsProperty?: number | null | string;
    numberOfFloorsCommon?: number | null | string;
    heatingType: string | null;
    areaLand?: string | number;
    areaLiving?: string | number;
    areaTotal?: string | number;
    upkeepType?: string | null;
    yearBuilt?: string | number;
    // buildingType?: string;
    outsideArea?: string | number;
    garage?: string | number;
    garden?: string | number;
    volume?: string | number;
    buildingtype?: string | null;
    characteristics?: string;
    description?: string;
    address: {
      administrativeAreaLevelOne?: string;
      locality?: string;
      neighborhood?: string;
      postalCode?: string;
      route?: string;
      streetNumber?: string;
      longitude?: string | number;
      latitude?: string | number;
    };
    images?: {
      imagePath: string;
      positionInListing: number;
      url: string;
    }[];
  };
  export interface CreateAPIPayload extends CreateProps {
    data: CreateMutationPayload;
  }

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
    company: Company | null;
    applicationUser: ApplicationUser;
    ListingImage: ListingImage[];
    Address: Address[];
    ListingPrice: ListingPrice[];
    averagePriceInNeighborhood: number | null;
    buildingType?: string | number;
    areaGarden?: string | number;
    balcony?: string;
  };
  export interface listingDetailPageAPIPayload extends listingDetailPageProps {}

  //UPDATE Property
  export type UpdatePropertyProp = {
    authToken: string;
  };
  export type UpdatePropertyResponse = {};
  export type UpdatePropertyMutationPayload = {
    listingType: string;
    streetNumber?: number | string;
    interiorType: string;
    propertyType: string;
    currency: string;
    price: number | string;
    rooms?: number | null | string;
    bathrooms?: number | null | string;
    bedrooms?: number | null | string;
    parking?: number | null | string;
    floorNumber?: number | null | string;
    numberOfFloorsProperty?: number | null | string;
    numberOfFloorsCommon?: number | null | string;
    heatingType: string;
    areaLand?: string | number;
    areaLiving?: string | number;
    areaTotal?: string | number;
    upkeepType?: string;
    yearBuilt?: string | number;
    buildingType?: string;
    outsideArea?: string | number;
    garage?: string | number;
    garden?: string | number;
    volume?: string | number;
    buildingtype?: string;
    characteristics?: string;
    description?: string;
    address: {
      administrativeAreaLevelOne?: string;
      locality?: string;
      neighborhood?: string;
      postalCode?: string;
      route?: string;
      streetNumber?: string;
      longitude?: string | number;
      latitude?: string | number;
    };
    images?: {
      imagePath: string;
      positionInListing: number;
      url: string;
    }[];
  };
  export interface PutAPIPayload extends UpdatePropertyProp {
    data: UpdatePropertyMutationPayload;
  }
}
