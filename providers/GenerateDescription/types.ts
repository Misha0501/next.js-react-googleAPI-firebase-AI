export namespace Description {
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
    buildingType?: string | null;
    outsideArea?: string | number;
    garage?: string | number;
    garden?: string | number;
  };
  export interface CreateAPIPayload extends CreateProps {
    data: CreateMutationPayload;
  }
}
