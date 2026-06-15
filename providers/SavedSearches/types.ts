import { SavedSearch } from "@/types";

export namespace SavedSearchesProvider {
  export type ReadResponse = {
    total: number;
    results: SavedSearch[];
  };

  export type CreateMutationPayload = {
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

  export type DeleteMutationPayload = { id?: number };
}
