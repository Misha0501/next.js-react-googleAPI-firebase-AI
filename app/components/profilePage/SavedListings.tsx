"use client";

import { useMemo } from "react";
import { ListingItem, ListingItemSkeleton } from "@/app/components/ListingItem";
import { useAuthContext } from "@/app/context/AuthContext";
import { SavedListing } from "@/types";
import { useSavedListings } from "@/providers/SavedListings";
import Link from "next/link";
import { HeartIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export const SavedListings = () => {
  const { authToken } = useAuthContext();

  const {
    data: savedListingsData,
    isLoading,
    error,
    refetch,
  } = useSavedListings({ authToken });

  const savedListings = useMemo(() => {
    if (savedListingsData && savedListingsData.results) {
      // Populated listings with saved data
      return savedListingsData.results.map((savedListing: SavedListing) => {
        savedListing.listing.savedListingId = savedListing.id;
        return savedListing;
      });
    }
    return [];
  }, [savedListingsData]);

  if (error)
    return (
      <p className="rounded-2xl border border-rose-100 bg-rose-50 px-5 py-4 text-sm font-semibold text-rose-600">
        Oops something went wrong please try again later
      </p>
    );

  return (
    <div className="w-full">
      <div>
        {!isLoading && savedListings && savedListings.length > 0 && (
          <div className="mb-6 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF2FF] text-[#1F5FD6]">
                <HeartIcon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-[#717D96]">
                  Saved properties
                </p>
                <p className="font-semibold text-[#2D3648]">
                  {savedListingsData?.total}{" "}
                  {savedListingsData?.total === 0 ||
                  savedListingsData!.total > 1
                    ? "properties"
                    : "property"}{" "}
                  saved
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <ListingItemSkeleton key={i} />
              ))
            : savedListings.map((item: SavedListing, index) => (
                <ListingItem
                  listingItemInitial={item.listing}
                  key={index}
                  onStateChanged={refetch}
                />
              ))}
        </div>
        {!isLoading && savedListings && !savedListings.length && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EAF2FF] text-[#1F5FD6]">
              <HeartIcon className="h-7 w-7" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-[#2D3648]">
              No saved properties yet
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#717D96]">
              Save listings while browsing to compare them later from this
              account area.
            </p>
            <Link
              href="/listings"
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-[#1F5FD6] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#184FB5]"
            >
              <MagnifyingGlassIcon className="h-4 w-4" />
              Browse properties
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
