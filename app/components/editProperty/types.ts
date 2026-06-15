import { ListingImage } from "@/types";

export type EditPropertyValues = {
  listingType?: string;
  propertyType?: string;
  streetNumber?: string;
  route?: string;
  locality?: string;
  neighborhood?: string;
  administrativeArea?: string;
  postalCode?: string;
  latitude?: string;
  longitude?: string;
  currency?: string;
  price?: number | string;
  rooms?: number | string;
  bedrooms?: number | string;
  bathrooms?: number | string;
  parking?: number | string;
  totalArea?: number | string;
  livingArea?: number | string;
  areaOutside?: number | string;
  areaGarage?: number | string;
  volume?: number | string;
  interiorType?: string;
  upkeepType?: string;
  heatingType?: string;
  constructedYear?: number | string;
  numberOfFloorsCommon?: number | string;
  floorNumber?: number | string;
  description?: string;
  images: ListingImage[];
};

export type ErrorMap = Partial<Record<keyof EditPropertyValues, string>>;
