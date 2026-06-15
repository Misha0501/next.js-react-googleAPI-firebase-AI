"use client";

import { useMemo, useState } from "react";
import { Listing } from "@/types";
import { formatEuroPrice } from "@/app/lib/formatPrice";

type Prop = {
  listing: Listing;
};

type DetailItem = {
  title: string;
  value?: string | number | null;
  testId?: string;
};

type DetailSectionProps = {
  title: string;
  items: DetailItem[];
  testId: string;
};

const displayValue = (value?: string | number | null) => {
  if (value === null || value === undefined || value === "") return "-";

  return value;
};

const humanize = (value?: string | null) => {
  if (!value) return "-";

  return value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const formatDate = (date?: string | null) => {
  if (!date) return "-";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "-";

  return parsedDate.toLocaleDateString("en-GB");
};

const formatYear = (date?: string | null) => {
  if (!date) return "-";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "-";

  return parsedDate.getFullYear();
};

const formatSquareMeters = (value?: number | null) =>
  value === null || value === undefined ? "-" : `${value} m²`;

const formatCubicMeters = (value?: number | null) =>
  value === null || value === undefined ? "-" : `${value} m³`;

const DetailSection = ({ title, items, testId }: DetailSectionProps) => (
  <section className="border-t border-slate-100 px-5 py-6 sm:px-6 lg:px-8">
    <h2 className="text-lg font-semibold text-[#2D3648] sm:text-xl">{title}</h2>
    <div
      className="mt-5 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2"
      data-testid={testId}
    >
      {items.map((item, index) => (
        <div
          key={index}
          data-testid={item.testId}
          className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3 last:border-b-0 sm:last:border-b"
        >
          <p className="text-sm text-[#717D96]">{item.title}</p>
          <p className="text-right text-sm font-semibold text-[#2D3648]">
            {displayValue(item.value)}
          </p>
        </div>
      ))}
    </div>
  </section>
);

export const ListingDetailContent = ({ listing }: Prop) => {
  const [showMore, setShowMore] = useState(false);

  const description = listing?.description ?? "";

  const hasLongDescription = useMemo(() => {
    return description.length > 400;
  }, [description]);

  const formattedDescription = useMemo(() => {
    if (!hasLongDescription || showMore) return description;

    return `${description.slice(0, 400)}...`;
  }, [description, hasLongDescription, showMore]);

  const generalInfo = useMemo(
    () => [
      {
        title: "Price",
        value: formatEuroPrice(listing?.price, { fallback: "-" }),
      },
      { title: "Offer type", value: humanize(listing?.listingType) },
      { title: "Property type", value: humanize(listing?.propertyType) },
      { title: "Offered since", value: formatDate(listing?.createdAt) },
      { title: "Rooms", value: listing?.rooms },
      { title: "Bedrooms", value: listing?.bedrooms },
      { title: "Bathrooms", value: listing?.bathrooms },
      { title: "Interior", value: humanize(listing?.interiorType) },
    ],
    [listing],
  );

  const areaAndCapacity = useMemo(
    () => [
      { title: "Total area", value: formatSquareMeters(listing?.areaTotal) },
      { title: "Living area", value: formatSquareMeters(listing?.areaLiving) },
      {
        title: "Outside area",
        value: formatSquareMeters(listing?.areaOutside),
      },
      { title: "Garden area", value: formatSquareMeters(listing?.areaGarden) },
      { title: "Land area", value: formatSquareMeters(listing?.areaLand) },
      { title: "Garage area", value: formatSquareMeters(listing?.areaGarage) },
      { title: "Volume", value: formatCubicMeters(listing?.volume) },
    ],
    [listing],
  );

  const construction = useMemo(
    () => [
      { title: "Year built", value: formatYear(listing?.constructedYear) },
      { title: "Building type", value: listing?.buildingType },
      { title: "Floor number", value: listing?.floorNumber },
      {
        title: "Floors in building",
        value: listing?.numberOfFloorsCommon,
      },
      {
        title: "Floors in property",
        value: listing?.numberOfFloorsProperty,
      },
      {
        title: "Heating",
        value: humanize(listing?.heatingType),
        testId: "heating",
      },
      { title: "Upkeep", value: humanize(listing?.upkeepType) },
      { title: "Parking places", value: listing?.parking },
    ],
    [listing],
  );

  if (!listing) {
    return null;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {description && (
        <section className="px-5 py-6 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-lg font-semibold text-[#2D3648] sm:text-xl">
              Description
            </h2>
            <p
              className="mt-4 text-base font-normal leading-7 text-[#4A5468]"
              data-testid="description"
            >
              {formattedDescription}
            </p>
            {!showMore && hasLongDescription && (
              <button
                type="button"
                className="mt-4 text-sm font-semibold text-[#1F5FD6] underline-offset-4 hover:underline"
                onClick={() => setShowMore(!showMore)}
                data-testid="showMoreBtn"
              >
                Show more
              </button>
            )}
          </div>
        </section>
      )}

      <DetailSection
        title="General information"
        items={generalInfo}
        testId="generalInfo"
      />
      <DetailSection
        title="Area and capacity"
        items={areaAndCapacity}
        testId="areaAndCapacity"
      />
      <DetailSection
        title="Building and comfort"
        items={construction}
        testId="construction"
      />
    </div>
  );
};
