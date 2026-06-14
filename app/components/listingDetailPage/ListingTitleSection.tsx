import { Listing } from "@/types";
import {
  HomeModernIcon,
  MapPinIcon,
  TagIcon,
} from "@heroicons/react/24/outline";

type Prop = {
  listing: Listing;
};

const capitalize = (s: string) =>
  s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";

const propertyTypeLabels: Record<string, string> = {
  APARTMENT: "Apartment",
  HOUSE: "House",
  LAND: "Land",
  PARKING: "Parking",
};

const listingTypeLabels: Record<string, string> = {
  RENT: "For rent",
  SELL: "For sale",
};

export const ListingTitleSection = ({ listing }: Prop) => {
  if (!listing) return null;

  const address = listing.Address?.[0];
  const propertyType =
    propertyTypeLabels[listing.propertyType] ??
    capitalize(listing.propertyType);
  const listingType =
    listingTypeLabels[listing.listingType] ??
    `For ${capitalize(listing.listingType)}`;

  const parts = [
    propertyType,
    listing?.rooms ? `${listing.rooms} rooms` : null,
    address?.locality ? `in ${capitalize(address.locality)}` : null,
  ].filter(Boolean);

  const addressLine = [
    address?.route,
    address?.streetNumber,
    address?.locality,
  ].filter(Boolean);

  return (
    <div className="min-w-0">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        {propertyType && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase text-[#2D3648] shadow-sm">
            <HomeModernIcon className="h-3.5 w-3.5 text-[#1F5FD6]" />
            {propertyType}
          </span>
        )}
        {listingType && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#CFE0FF] bg-[#EAF2FF] px-3 py-1 text-xs font-semibold uppercase text-[#1F5FD6] shadow-sm">
            <TagIcon className="h-3.5 w-3.5" />
            {listingType}
          </span>
        )}
      </div>

      <h1 className="max-w-4xl text-2xl font-semibold leading-tight text-[#2D3648] sm:text-3xl lg:text-4xl">
        {parts.join(" ")}
      </h1>

      {addressLine.length > 0 && (
        <p className="mt-3 flex items-start gap-2 text-sm font-medium text-[#717D96] sm:text-base">
          <MapPinIcon className="mt-0.5 h-5 w-5 shrink-0 text-[#1F5FD6]" />
          <span>{addressLine.join(", ")}</span>
        </p>
      )}
    </div>
  );
};
