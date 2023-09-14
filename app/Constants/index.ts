import {
  CurrencyType,
  HeatingType,
  InteriorType,
  ListingType,
  PropertyType,
  UpkeepType,
} from "@/types";

export const HEATING_TYPES: HeatingType[] = ["CENTRAL", "BOILER"];
export const INTERIOR_TYPES: InteriorType[] = ["FURNISHED", "UNFURNISHED"];
export const UPKEEP_TYPES: UpkeepType[] = ["EXCELLENT", "GOOD", "FAIR", "POOR"];
export const LISTING_TYPES: ListingType[] = ["RENT", "SELL"];
export const CURRENCIES: CurrencyType[] = ["EUR", "USD", "BGN"];

export const PROPERTY_TYPES: PropertyType[] = [
  "HOUSE",
  "APARTMENT",
  "PARKING",
  "LAND",
];
