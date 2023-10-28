import { Listing } from "@/types";

export namespace ListingProvider {
  export type ListingsProps = {
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
    pageSize?: string | number | null;
    page?: string | number | null;
  };
  export interface ListingAPIPayload extends ListingsProps {}

  export type CreateProps = {};

  export type CreateResponse = {};

  export type CreateMutationPayload = Listing;
  export interface CreateAPIPayload extends CreateProps {
    data: CreateMutationPayload;
  }

  //UPDATE Property
  export type UpdatePropertyProp = {
    authToken: string;
  };
  export interface PutAPIPayload extends UpdatePropertyProp {
    data: Listing;
  }
}
