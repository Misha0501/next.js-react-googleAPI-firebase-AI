import {
  ArrowsPointingOutIcon,
  BuildingOffice2Icon,
  CalendarDaysIcon,
  FireIcon,
  HomeIcon,
  HomeModernIcon,
  MapIcon,
  SparklesIcon,
  Squares2X2Icon,
  TruckIcon,
  UserGroupIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";
import type { ReactNode } from "react";
import type { Listing } from "@/types";
import { roundNumberTwoDecimal } from "@/app/lib/roundNumberTwoDecimal";

export type ListingFeature = {
  key: string;
  label: string;
  icon: ReactNode;
};

export const FEATURE_ICON_CLASS_NAME = "h-4 w-4 shrink-0";
export const LISTING_IMAGE_PLACEHOLDER_SRC = "/imagePlaceholder.png";
export const LISTING_IMAGE_BLUR_DATA_URL =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
export const MAX_VISIBLE_FEATURES = 6;

export const PROPERTY_TYPE_FEATURES: Record<
  Listing["propertyType"],
  { label: string; icon: ReactNode }
> = {
  APARTMENT: {
    label: "Apartment",
    icon: <BuildingOffice2Icon className={FEATURE_ICON_CLASS_NAME} />,
  },
  HOUSE: {
    label: "House",
    icon: <HomeModernIcon className={FEATURE_ICON_CLASS_NAME} />,
  },
  LAND: {
    label: "Land",
    icon: <MapIcon className={FEATURE_ICON_CLASS_NAME} />,
  },
  PARKING: {
    label: "Parking",
    icon: <TruckIcon className={FEATURE_ICON_CLASS_NAME} />,
  },
};

const INTERIOR_TYPE_LABELS: Record<Listing["interiorType"], string> = {
  FURNISHED: "Furnished",
  UNFURNISHED: "Unfurnished",
};

const HEATING_TYPE_LABELS: Record<Listing["heatingType"], string> = {
  BOILER: "Boiler heating",
  CENTRAL: "Central heating",
};

const UPKEEP_TYPE_LABELS: Record<Listing["upkeepType"], string> = {
  EXCELLENT: "Excellent upkeep",
  FAIR: "Fair upkeep",
  GOOD: "Good upkeep",
  POOR: "Needs upkeep",
};

export const LISTING_TYPE_LABELS: Record<Listing["listingType"], string> = {
  RENT: "For rent",
  SELL: "For sale",
};

const getFiniteNumber = (value?: number | string | null) => {
  if (value === null || value === undefined || value === "") return null;

  const numericValue = Number(value);

  return Number.isFinite(numericValue) ? numericValue : null;
};

const getPositiveNumber = (value?: number | string | null) => {
  const numericValue = getFiniteNumber(value);

  return numericValue && numericValue > 0 ? numericValue : null;
};

const formatFeatureNumber = (value: number) => {
  const roundedValue = roundNumberTwoDecimal(value);

  return Number.isInteger(roundedValue)
    ? roundedValue.toString()
    : roundedValue.toFixed(2);
};

export const pluralize = (value: number, singular: string, plural: string) => {
  return value === 1 ? singular : plural;
};

export const getNewListingLabel = (createdAt: Listing["createdAt"]) => {
  const date = new Date(createdAt);
  const diffTime = Math.abs(new Date().getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays < 7 ? "New" : null;
};

const getConstructedYear = (
  value?: Listing["constructedYear"] | Date | number | null,
) => {
  if (!value) return null;

  if (typeof value === "number") {
    return value >= 1800 && value <= new Date().getFullYear() + 5
      ? value
      : null;
  }

  const date = new Date(value);
  const year = date.getFullYear();

  return Number.isFinite(date.getTime()) && year >= 1800 ? year : null;
};

const getFloorLabel = (listing: Listing) => {
  const floorNumber = getFiniteNumber(listing.floorNumber);
  const totalFloors = getPositiveNumber(listing.numberOfFloorsCommon);

  if (floorNumber === null) return null;

  const floorLabel =
    floorNumber === 0 ? "Ground floor" : `Floor ${floorNumber}`;

  return totalFloors ? `${floorLabel}/${totalFloors}` : floorLabel;
};

export const getListingFeatures = (listing: Listing): ListingFeature[] => {
  const features: ListingFeature[] = [];
  const propertyTypeFeature = listing.propertyType
    ? PROPERTY_TYPE_FEATURES[listing.propertyType]
    : null;
  const areaTotal = getPositiveNumber(listing.areaTotal);
  const areaLiving = getPositiveNumber(listing.areaLiving);
  const areaLand = getPositiveNumber(listing.areaLand);
  const areaOutside = getPositiveNumber(listing.areaOutside);
  const areaGarage = getPositiveNumber(listing.areaGarage);
  const rooms = getPositiveNumber(listing.rooms);
  const bedrooms = getPositiveNumber(listing.bedrooms);
  const bathrooms = getPositiveNumber(listing.bathrooms);
  const parking = getPositiveNumber(listing.parking);
  const propertyFloors = getPositiveNumber(listing.numberOfFloorsProperty);
  const floorLabel = getFloorLabel(listing);
  const constructedYear = getConstructedYear(listing.constructedYear);

  if (propertyTypeFeature) {
    features.push({
      key: "property-type",
      ...propertyTypeFeature,
    });
  }

  if (areaTotal) {
    features.push({
      key: "area-total",
      label: `${formatFeatureNumber(areaTotal)} m² total`,
      icon: <ArrowsPointingOutIcon className={FEATURE_ICON_CLASS_NAME} />,
    });
  }

  if (areaLiving && areaLiving !== areaTotal) {
    features.push({
      key: "area-living",
      label: `${formatFeatureNumber(areaLiving)} m² living`,
      icon: <HomeIcon className={FEATURE_ICON_CLASS_NAME} />,
    });
  }

  if (areaLand) {
    features.push({
      key: "area-land",
      label: `${formatFeatureNumber(areaLand)} m² land`,
      icon: <MapIcon className={FEATURE_ICON_CLASS_NAME} />,
    });
  }

  if (rooms) {
    features.push({
      key: "rooms",
      label: `${rooms} ${pluralize(rooms, "room", "rooms")}`,
      icon: <Squares2X2Icon className={FEATURE_ICON_CLASS_NAME} />,
    });
  }

  if (bedrooms) {
    features.push({
      key: "bedrooms",
      label: `${bedrooms} ${pluralize(bedrooms, "bed", "beds")}`,
      icon: <UserGroupIcon className={FEATURE_ICON_CLASS_NAME} />,
    });
  }

  if (bathrooms) {
    features.push({
      key: "bathrooms",
      label: `${bathrooms} ${pluralize(bathrooms, "bath", "baths")}`,
      icon: <SparklesIcon className={FEATURE_ICON_CLASS_NAME} />,
    });
  }

  if (floorLabel) {
    features.push({
      key: "floor",
      label: floorLabel,
      icon: <BuildingOffice2Icon className={FEATURE_ICON_CLASS_NAME} />,
    });
  }

  if (propertyFloors && propertyFloors > 1) {
    features.push({
      key: "property-floors",
      label: `${propertyFloors} levels`,
      icon: <BuildingOffice2Icon className={FEATURE_ICON_CLASS_NAME} />,
    });
  }

  if (parking) {
    features.push({
      key: "parking",
      label: `${parking} ${pluralize(parking, "space", "spaces")}`,
      icon: <TruckIcon className={FEATURE_ICON_CLASS_NAME} />,
    });
  }

  if (areaGarage) {
    features.push({
      key: "garage",
      label: `${formatFeatureNumber(areaGarage)} m² garage`,
      icon: <TruckIcon className={FEATURE_ICON_CLASS_NAME} />,
    });
  }

  if (areaOutside) {
    features.push({
      key: "outside",
      label: `${formatFeatureNumber(areaOutside)} m² outside`,
      icon: <HomeModernIcon className={FEATURE_ICON_CLASS_NAME} />,
    });
  }

  if (constructedYear) {
    features.push({
      key: "constructed-year",
      label: `Built ${constructedYear}`,
      icon: <CalendarDaysIcon className={FEATURE_ICON_CLASS_NAME} />,
    });
  }

  if (listing.interiorType) {
    features.push({
      key: "interior",
      label: INTERIOR_TYPE_LABELS[listing.interiorType],
      icon: <HomeIcon className={FEATURE_ICON_CLASS_NAME} />,
    });
  }

  if (listing.heatingType) {
    features.push({
      key: "heating",
      label: HEATING_TYPE_LABELS[listing.heatingType],
      icon: <FireIcon className={FEATURE_ICON_CLASS_NAME} />,
    });
  }

  if (listing.upkeepType) {
    features.push({
      key: "upkeep",
      label: UPKEEP_TYPE_LABELS[listing.upkeepType],
      icon: <WrenchScrewdriverIcon className={FEATURE_ICON_CLASS_NAME} />,
    });
  }

  return features;
};
