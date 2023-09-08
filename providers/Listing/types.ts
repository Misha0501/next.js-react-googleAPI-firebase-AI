export namespace Poperty {
  export type ListingProps = {
    propertyTypeId?: string | null;
    areaTotalMin?: string | null;
    areaTotalMax?: string | null;
    areaLivingMin?: string | null;
    areaLivingMax?: string | null;
    areaLandMin?: string | null;
    areaLandMax?: string | null;
    roomsMin?: string | null;
    roomsMax?: string | null;
    bedroomsMin?: string | null;
    bedroomsMax?: string | null;
    listedSince?: string | null;
    constructedYearMin?: string | null;
    constructedYearMax?: string | null;
  };
  export interface ListingAPIPayload extends ListingProps {}
}
