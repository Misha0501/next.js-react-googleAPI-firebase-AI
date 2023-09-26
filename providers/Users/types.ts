export namespace Users {
  export interface Company {
    id: number;
    name: string;
    phoneNumber: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    Address: Address[];
    Listing: Listing[];
  }

  export interface Address {
    id: number;
    streetNumber: string;
    route: string;
    administrativeAreaLevelOne: null | string;
    locality: string;
    postalCode: string;
    neighborhood: string;
    latitude: string;
    longitude: string;
    showExactLocation: boolean;
    createdAt: Date;
    updatedAt: Date;
    listingId: number | null;
    companyId: number | null;
  }

  export interface Listing {
    id: number;
    applicationUserId: number;
    companyId: number;
    listingType: string;
    interiorType: string;
    upkeepType: string;
    propertyType: string;
    description: string;
    price: number;
    currency: string;
    locality: null;
    areaTotal: number;
    areaLiving: number;
    areaLand: number;
    volume: number;
    areaOutside: number;
    areaGarage: number;
    streetName: string;
    houseNumber: string;
    postalCode: null;
    longitude: string;
    latitude: string;
    rooms: number;
    bathrooms: number;
    bedrooms: number;
    parking: number;
    constructedYear: Date;
    floorNumber: number;
    numberOfFloorsProperty: number;
    numberOfFloorsCommon: number;
    heatingType: string;
    active: null;
    activeUntil: null;
    createdAt: Date;
    updatedAt: Date;
    deleted: null;
    ListingImage: ListingImage[];
    Address: Address[];
    ListingPrice: ListingPrice[];
  }

  export interface ListingImage {
    id: number;
    listingId: number;
    positionInListing: number;
    url: string;
    createdAt: Date;
    updatedAt: Date;
  }

  export interface ListingPrice {
    id: number;
    listingId: number;
    currency: string;
    tax: null;
    price: number;
    updatedListingPriceId: null;
    createdAt: Date;
    updatedAt: Date;
  }
  export type DetailProps = {
    id?: number;
  };
  export interface DetailAPIPayload extends DetailProps {}
  export interface DetailResponse {
    id: number;
    email: string;
    displayName: string;
    phoneNumber: string;
    createdAt: string;
    Company?: Company;
    Listing?: Listing[];
  }
}
