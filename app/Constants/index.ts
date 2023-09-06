import {
  CurrencyType,
  HeatingType,
  InteriorType,
  ListingType,
  UpkeepType,
} from "@/types";

export const HEATING_TYPE: HeatingType[] = ["CENTRAL", "BOILER"];
export const INTERIOR_TYPE: InteriorType[] = ["FURNISHED", "UNFURNISHED"];
export const UPKEEP_TYPE: UpkeepType[] = ["EXCELLENT", "GOOD", "FAIR", "POOR"];
export const LISTING_TYPE: ListingType[] = ["RENT", "SELL"];
export const CURRENCY: CurrencyType[] = ["EUR", "USD", "BGN"];
