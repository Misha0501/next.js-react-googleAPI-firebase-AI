"use client";

import Link from "next/link";
import { CircularProgress } from "@mui/material";
import { ListingItem } from "@/app/components/ListingItem";
import { usePropertyListing } from "@/providers/Listing";
import { Listing } from "@/types";

function RecentlyPlacedPropertiesSection() {
  const { data, isLoading, isError } = usePropertyListing({
    page: 1,
    pageSize: 6,
    sortBy: "createdAtDesc",
  });

  const listings: Listing[] = data?.results || [];

  return (
    <section className="max-w-screen-xl m-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-28">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-10">
        <div>
          <h3 className="text-[#222222] font-bold text-2xl md:text-[40px]">
            Recently placed properties
          </h3>
          <p className="text-[#717D96] mt-3">
            Fresh listings from owners and agencies.
          </p>
        </div>
        <Link
          href="/listings?sortBy=createdAtDesc"
          className="text-[#0071b3] font-bold hover:underline"
        >
          View all properties
        </Link>
      </div>

      {isLoading && (
        <div className="flex justify-center py-12">
          <CircularProgress />
        </div>
      )}

      {isError && (
        <p className="text-red-500">
          Oops there was an error loading recent properties.
        </p>
      )}

      {!isLoading && !isError && listings.length === 0 && (
        <p className="text-[#717D96]">No properties have been placed yet.</p>
      )}

      {listings.length > 0 && (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => (
            <ListingItem listingItemInitial={listing} key={listing.id} />
          ))}
        </div>
      )}
    </section>
  );
}

export default RecentlyPlacedPropertiesSection;
