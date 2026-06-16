"use client";

import Link from "next/link";
import { ListingItem, ListingItemSkeleton } from "@/app/components/ListingItem";
import { usePropertyListing } from "@/providers/Listing";
import { Listing } from "@/types";

const RecentlyPlacedPropertiesSection = () => {
  const { data, isLoading, isError } = usePropertyListing({
    page: 1,
    pageSize: 6,
    sortBy: "createdAtDesc",
  });

  const listings: Listing[] = data?.results || [];

  return (
    <section className="border-b border-slate-200/80 bg-white py-20 lg:py-24">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h3 className="text-2xl font-bold text-[#222222] md:text-[40px]">
              Recently placed properties
            </h3>
            <p className="mt-3 text-[#717D96]">
              Fresh properties from owners and agencies.
            </p>
          </div>
          <Link
            href="/listings?sortBy=createdAtDesc"
            className="font-bold text-[#1F5FD6] hover:underline"
          >
            View all properties
          </Link>
        </div>

        {isError && (
          <p className="text-red-500">
            Oops there was an error loading recent properties.
          </p>
        )}

        {!isLoading && !isError && listings.length === 0 && (
          <p className="text-[#717D96]">No properties have been placed yet.</p>
        )}

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <ListingItemSkeleton key={i} />
              ))
            : listings.map((listing) => (
                <ListingItem listingItemInitial={listing} key={listing.id} />
              ))}
        </div>
      </div>
    </section>
  );
};

export default RecentlyPlacedPropertiesSection;
