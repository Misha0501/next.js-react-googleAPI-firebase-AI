"use client";
import { useEffect, useState } from "react";
import { useAuthContext } from "@/app/context/AuthContext";
import { Listing } from "@/types";
import { ListingItem, ListingItemSkeleton } from "@/app/components/ListingItem";
import { useRecentlyViewedListings } from "@/providers/RecentlyViewedListings";
import { useSavedListings } from "@/providers/SavedListings";
import { getPopulatedListingsSaved } from "@/app/lib/listing/getPopulatedListingsSaved";
import { Pagination } from "@/app/components/shared/Pagination";
import Link from "next/link";
import { ClockIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

const PAGE_SIZE = 8;

export const RecentlyViewedListings = () => {
  const { authToken } = useAuthContext();
  const [page, setPage] = useState(1);
  const [populatedListings, setPopulatedListings] = useState<Listing[]>([]);
  const recentlyViewedListingsResponse = useRecentlyViewedListings({
    authToken,
    page,
  });
  const savedListings = useSavedListings({ authToken });

  const total = recentlyViewedListingsResponse.data?.total ?? 0;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  useEffect(() => {
    if (!recentlyViewedListingsResponse.isSuccess) return;
    const recentlyViewedListingsData =
      recentlyViewedListingsResponse?.data?.results;
    const recentlyViewedListings = recentlyViewedListingsData.map(
      (item) => item.listing,
    );
    setPopulatedListings(recentlyViewedListings);

    if (!savedListings.isSuccess) return;
    const savedListingsData = savedListings?.data?.results;
    const populated = getPopulatedListingsSaved(
      recentlyViewedListings,
      savedListingsData,
    );
    setPopulatedListings(populated);
  }, [
    recentlyViewedListingsResponse.data?.results,
    recentlyViewedListingsResponse.isSuccess,
    savedListings.data?.results,
    savedListings.isSuccess,
  ]);

  return (
    <div className="w-full">
      {recentlyViewedListingsResponse.isError && (
        <p className="rounded-2xl border border-rose-100 bg-rose-50 px-5 py-4 text-sm font-semibold text-rose-600">
          Oops! Something went wrong. Please try again.
        </p>
      )}
      {total > 0 && (
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF2FF] text-[#1F5FD6]">
              <ClockIcon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-[#717D96]">
                Recently viewed
              </p>
              <p className="font-semibold text-[#2D3648]">
                {total}{" "}
                {total === 1 ? "property" : "properties"}
              </p>
            </div>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {recentlyViewedListingsResponse.isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <ListingItemSkeleton key={i} />
            ))
          : populatedListings.map((item, index) => (
              <ListingItem listingItemInitial={item} key={index} />
            ))}
      </div>
      {!recentlyViewedListingsResponse.isLoading &&
        !recentlyViewedListingsResponse.isError &&
        populatedListings &&
        !populatedListings.length && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EAF2FF] text-[#1F5FD6]">
              <ClockIcon className="h-7 w-7" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-[#2D3648]">
              No recently viewed properties
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#717D96]">
              Open properties while browsing and they will appear here for quick
              access.
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

      {totalPages > 1 && (
        <div className="mt-6">
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}
    </div>
  );
};
