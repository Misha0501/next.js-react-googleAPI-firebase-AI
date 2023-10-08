import {
  BuildingType,
  Characteristics,
  CurrencyType,
  HeatingType,
  InteriorType,
  ListingType,
  PropertyType,
  UpkeepType,
  CompanyMembershipRoleType
} from "@/types";

export const HEATING_TYPES: HeatingType[] = ["CENTRAL", "BOILER"];
export const INTERIOR_TYPES: InteriorType[] = ["FURNISHED", "UNFURNISHED"];
export const UPKEEP_TYPES: UpkeepType[] = ["EXCELLENT", "GOOD", "FAIR", "POOR"];
export const LISTING_TYPES: ListingType[] = ["RENT", "SELL"];
export const CURRENCIES: CurrencyType[] = ["EUR"];
export const PROPERTY_TYPES: PropertyType[] = [
  "HOUSE",
  "APARTMENT",
  "PARKING",
  "LAND",
];
export const BUILDING_TYPE: BuildingType[] = ["New building", "Old building"];
export const CHARACTERISTICS: Characteristics[] = [
  "Balcony",
  "Garden",
  "Renewable energy",
  "Lying / sitting bath",
  "Swimming pool",
];
export const COMPANY_MEMBERSHIP_ROLE: CompanyMembershipRoleType[] = [
  // "ADMIN",
  "EDITOR",
];