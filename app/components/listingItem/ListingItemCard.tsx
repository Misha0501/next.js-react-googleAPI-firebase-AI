"use client";

import Image from "next/image";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/solid";
import { MapPinIcon, PhotoIcon } from "@heroicons/react/24/outline";
import { forwardRef, type KeyboardEventHandler, type ReactNode } from "react";
import type { Listing } from "@/types";
import {
  formatEuroPrice,
  formatEuroPricePerSquareMeter,
} from "@/app/lib/formatPrice";
import { roundNumberTwoDecimal } from "@/app/lib/roundNumberTwoDecimal";
import { ListingItemFeatures } from "@/app/components/listingItem/ListingItemFeatures";
import {
  getListingFeatures,
  getNewListingLabel,
  LISTING_IMAGE_BLUR_DATA_URL,
  LISTING_IMAGE_PLACEHOLDER_SRC,
  LISTING_TYPE_LABELS,
  MAX_VISIBLE_FEATURES,
  pluralize,
  PROPERTY_TYPE_FEATURES,
} from "@/app/components/listingItem/ListingItemData";

type ListingItemCardProps = {
  listing: Listing;
  isLoading?: boolean;
  ownerView?: boolean;
  saveControl?: ReactNode;
  onClick: () => void;
  onKeyDown: KeyboardEventHandler<HTMLDivElement>;
  onEditClick: () => void;
  onDeleteClick: () => void;
};

export const ListingItemSkeleton = () => {
  return (
    <div className="h-fit overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="h-[242px] w-full animate-pulse bg-slate-200" />
      <div className="flex min-h-[180px] justify-between gap-2 p-5">
        <div className="flex w-full flex-col">
          <div className="mb-4">
            <div className="mb-2 h-5 w-[180px] animate-pulse rounded bg-slate-200" />
            <div className="h-5 w-[130px] animate-pulse rounded bg-slate-200" />
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="h-[34px] w-[130px] animate-pulse rounded bg-slate-200" />
            <div className="h-[34px] w-[120px] animate-pulse rounded bg-slate-200" />
            <div className="h-[34px] w-[150px] animate-pulse rounded bg-slate-200" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const ListingItemCard = forwardRef<HTMLDivElement, ListingItemCardProps>(
  function ListingItemCard(
    {
      listing,
      isLoading,
      ownerView = false,
      saveControl,
      onClick,
      onKeyDown,
      onEditClick,
      onDeleteClick,
    },
    ref,
  ) {
    const listingFeatures = getListingFeatures(listing);
    const listingImageUrl = listing.ListingImage?.find(
      (image) => image?.url,
    )?.url;
    const hasListingImage = Boolean(listingImageUrl);
    const listingImageSrc = listingImageUrl ?? LISTING_IMAGE_PLACEHOLDER_SRC;
    const imageCount =
      listing.ListingImage?.filter((image) => Boolean(image?.url)).length ?? 0;
    const visibleFeatures = listingFeatures.slice(0, MAX_VISIBLE_FEATURES);
    const hiddenFeatureCount = listingFeatures.length - visibleFeatures.length;
    const listingTypeLabel = listing.listingType
      ? LISTING_TYPE_LABELS[listing.listingType]
      : null;
    const propertyTypeLabel = listing.propertyType
      ? PROPERTY_TYPE_FEATURES[listing.propertyType]?.label
      : null;
    const locality = listing.Address?.[0]?.locality;
    const route = listing.Address?.[0]?.route;
    const cardTitle = [
      propertyTypeLabel,
      listing.rooms
        ? `${listing.rooms} ${pluralize(listing.rooms, "room", "rooms")}`
        : null,
    ]
      .filter(Boolean)
      .join(" ");
    const pricePerSquareMeter =
      listing.areaTotal && listing.price
        ? formatEuroPricePerSquareMeter(
            roundNumberTwoDecimal(listing.price / listing.areaTotal),
          )
        : null;
    const listingLabel = getNewListingLabel(listing.createdAt);

    return (
      <div
        ref={ref}
        role="link"
        tabIndex={0}
        onClick={onClick}
        onKeyDown={onKeyDown}
        className="animate-listing-card-enter group h-fit cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-[#CFE0FF] hover:shadow-[0_20px_45px_rgba(15,23,42,0.12)] focus:outline-none focus:ring-2 focus:ring-[#1F5FD6]/30 focus:ring-offset-2"
      >
        {isLoading ? (
          <div className="h-[242px] w-full animate-pulse bg-slate-200" />
        ) : (
          <div className="image-wrapper relative h-[242px] w-full overflow-hidden bg-slate-100">
            <Image
              className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
              width={384}
              height={240}
              src={listingImageSrc}
              alt={
                hasListingImage
                  ? "Picture of the property"
                  : "No property image available"
              }
              sizes="(min-width: 1024px) 384px, (min-width: 640px) 50vw, 100vw"
              placeholder="blur"
              blurDataURL={LISTING_IMAGE_BLUR_DATA_URL}
            />
            <div className="from-slate-950/45 absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t to-transparent" />
            <div className="absolute left-4 right-4 top-4 z-10 flex items-start justify-between gap-3">
              <div className="flex flex-wrap gap-2">
                {listingLabel && (
                  <span className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold uppercase text-white shadow-sm">
                    {listingLabel}
                  </span>
                )}
                {listingTypeLabel && (
                  <span className="rounded-full border border-white/50 bg-white/90 px-3 py-1 text-xs font-semibold uppercase text-[#1F5FD6] shadow-sm backdrop-blur">
                    {listingTypeLabel}
                  </span>
                )}
                {imageCount > 0 && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-white/50 bg-white/90 px-3 py-1 text-xs font-semibold text-[#2D3648] shadow-sm backdrop-blur">
                    <PhotoIcon className="h-3.5 w-3.5 text-[#1F5FD6]" />
                    {imageCount}
                  </span>
                )}
              </div>
              {saveControl}
            </div>
            {!hasListingImage && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-slate-950/5 text-slate-500">
                <PhotoIcon className="h-9 w-9" />
                <span className="bg-white/85 rounded-md px-3 py-1 text-sm font-semibold shadow-sm">
                  No image available
                </span>
              </div>
            )}
          </div>
        )}
        <div className="flex min-h-[190px] justify-between gap-3 p-5">
          <div className="flex w-full min-w-0 flex-col">
            <div className="mb-4">
              <div className="mb-2 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                {isLoading ? (
                  <div className="h-5 w-[170px] animate-pulse rounded bg-slate-200" />
                ) : (
                  <>
                    <span className="text-2xl font-semibold tracking-tight text-[#2D3648]">
                      {formatEuroPrice(listing.price)}
                    </span>
                    {pricePerSquareMeter && (
                      <span className="rounded-full bg-[#EAF2FF] px-2.5 py-1 text-xs font-semibold text-[#1F5FD6]">
                        {pricePerSquareMeter}
                      </span>
                    )}
                  </>
                )}
              </div>
              {isLoading ? (
                <div className="h-5 w-[140px] animate-pulse rounded bg-slate-200" />
              ) : (
                <>
                  <p className="truncate text-base font-semibold text-[#2D3648]">
                    {cardTitle || propertyTypeLabel || "Property"}
                  </p>
                  {(locality || route) && (
                    <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-[#717D96]">
                      <MapPinIcon className="h-4 w-4 shrink-0 text-[#1F5FD6]" />
                      <span className="truncate">
                        {[route, locality].filter(Boolean).join(", ")}
                      </span>
                    </p>
                  )}
                </>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <ListingItemFeatures
                features={visibleFeatures}
                hiddenFeatureCount={hiddenFeatureCount}
                isLoading={isLoading}
              />
            </div>
            {ownerView && (
              <div className="mt-5 grid grid-cols-2 gap-2 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 py-2 text-sm font-semibold text-[#2D3648] transition hover:border-[#CFE0FF] hover:bg-[#EAF2FF]"
                  onClick={(event) => {
                    event.stopPropagation();
                    onEditClick();
                  }}
                >
                  <PencilSquareIcon className="h-5 w-5 text-[#1F5FD6]" />
                  <span>Edit</span>
                </button>
                <button
                  type="button"
                  className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-rose-100 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-100"
                  onClick={(event) => {
                    event.stopPropagation();
                    onDeleteClick();
                  }}
                >
                  <TrashIcon className="h-5 w-5" />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  },
);
