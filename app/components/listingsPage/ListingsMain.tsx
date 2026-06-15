"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ListingItem, ListingItemSkeleton } from "@/app/components/ListingItem";
import { usePropertyListing } from "@/providers/Listing";
import { useAuthContext } from "@/app/context/AuthContext";
import { Listing, SavedListing } from "@/types";
import { NO_MAX } from "@/app/lib/constants/filters";
import type { FilterValues } from "./Filters";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useSavedListings } from "@/providers/SavedListings";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Props = {
  searchParams: FilterValues | null;
  listingType: string;
  locality: string;
};

const LISTINGS_PAGE_SIZE = 16;
const MAX_LISTINGS_PAGE = 1000000;
const EAGER_LISTING_ITEMS = 4;
const SKELETON_LISTING_ITEMS = 8;

const getPageFromSearchParams = (params: {
  get: (key: string) => string | null;
}) => {
  const page = Number(params.get("page"));
  return Number.isInteger(page) && page > 0 && page <= MAX_LISTINGS_PAGE
    ? page
    : 1;
};

export const ListingsMain = ({
  searchParams,
  listingType,
  locality,
}: Props) => {
  const { authToken } = useAuthContext();
  const pathname = usePathname();
  const router = useRouter();
  const urlSearchParams = useSearchParams();
  const urlQueryString = urlSearchParams.toString();
  const currentUrlPage = useMemo(
    () => getPageFromSearchParams(new URLSearchParams(urlQueryString)),
    [urlQueryString],
  );
  const [page, setPage] = useState(currentUrlPage);
  const pageSize = LISTINGS_PAGE_SIZE;
  const [sortBy, setSortBy] = useState(undefined);
  const { data: savedListingsData, isLoading: savedListingsIsLoading } =
    useSavedListings({ authToken });

  const {
    data: listingsData,
    isLoading,
    isError,
    isSuccess,
  } = usePropertyListing({
    priceMin: searchParams?.priceRange.min,
    priceMax:
      searchParams?.priceRange.max === NO_MAX
        ? undefined
        : searchParams?.priceRange.max,
    listedSince: searchParams?.listedSince,
    areaLivingMin: searchParams?.livingAreaRange.min,
    areaLivingMax:
      searchParams?.livingAreaRange.max === NO_MAX
        ? undefined
        : searchParams?.livingAreaRange.max,
    areaTotalMin: searchParams?.areaTotal.min,
    areaTotalMax:
      searchParams?.areaTotal.max === NO_MAX
        ? undefined
        : searchParams?.areaTotal.max,
    roomsMin: searchParams?.roomRange.min,
    roomsMax:
      searchParams?.roomRange.max === NO_MAX
        ? undefined
        : searchParams?.roomRange.max,
    bedroomsMin: searchParams?.bedroomRange.min,
    bedroomsMax:
      searchParams?.bedroomRange.max === NO_MAX
        ? undefined
        : searchParams?.bedroomRange.max,
    propertyType: searchParams?.propertyType,
    listingType: listingType,
    locality: locality,
    sortBy: sortBy,
    pageSize,
    page: page,
  });

  const updatePageUrl = useCallback(
    (value: number) => {
      const params = new URLSearchParams(urlQueryString);
      if (value > 1) {
        params.set("page", String(value));
      } else {
        params.delete("page");
      }

      const queryString = params.toString();
      router.push(queryString ? `${pathname}?${queryString}` : pathname);
    },
    [pathname, router, urlQueryString],
  );

  const handlePageChange = useCallback(
    (value: number) => {
      setPage(value);
      updatePageUrl(value);
    },
    [updatePageUrl],
  );

  const savedListings = useMemo(() => {
    if (!savedListingsData) return [];
    return savedListingsData.results;
  }, [savedListingsData]);

  const listings = useMemo(() => {
    if (!listingsData) return [];
    return listingsData.results;
  }, [listingsData]);

  const numberOfPages = useMemo(() => {
    if (!listingsData) return 0;
    return Math.ceil(listingsData.total / pageSize);
  }, [listingsData, pageSize]);
  const shouldShowListingSkeletons = isLoading && !listings.length;

  const populatedListings: Listing[] = useMemo(() => {
    if (!savedListings?.length) return listings;
    if (!listings?.length) return [];

    let savedListingsListingIds: number[] = [];

    // Store all savedListing's listingIds
    savedListingsListingIds = savedListings.map(
      (el: SavedListing) => el.listingId,
    );

    // populate listings with saved listings data
    const populatedListings = listings.map((listing: Listing) => {
      const savedListingListingId = savedListingsListingIds.find(
        (savedListingId) => savedListingId === listing.id,
      );

      const savedListing = savedListings.find(
        (savedListing: SavedListing) =>
          savedListing.listingId === savedListingListingId,
      );

      if (savedListingListingId && savedListingListingId && savedListing) {
        listing.savedListingId = savedListing.id;
      } else {
        listing.savedListingId = undefined;
      }
      return listing;
    });
    return populatedListings;
  }, [savedListings, listings]);

  useEffect(() => {
    setPage((previousPage) =>
      previousPage === currentUrlPage ? previousPage : currentUrlPage,
    );
  }, [currentUrlPage]);

  if (isError) {
    return (
      <div className="min-w-0 flex-1 rounded-xl border border-red-100 bg-white p-6 text-red-600 shadow-sm">
        Oops there was an error, please try again.
      </div>
    );
  }

  return (
    <div className="min-w-0 flex-1">
      <div className="mb-8 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        {isSuccess ? (
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-[#1F5FD6]">
                Results
              </p>
              <h2 className="mt-1 text-2xl font-bold text-[#222222]">
                {listingsData?.total} properties found
              </h2>
            </div>
            <p className="text-sm text-[#717D96]">
              Showing {populatedListings.length} on page {page}
              {numberOfPages > 0 ? ` of ${numberOfPages}` : ""}
            </p>
          </div>
        ) : (
          <div className="h-16 animate-pulse rounded-lg bg-slate-100" />
        )}
      </div>

      <div className="mb-12 grid grid-cols-[repeat(auto-fit,minmax(min(100%,360px),1fr))] gap-8 lg:gap-10">
        {shouldShowListingSkeletons
          ? Array.from({ length: SKELETON_LISTING_ITEMS }).map((_, index) => (
              <ListingItemSkeleton key={index} />
            ))
          : populatedListings.map((item, index) => (
              <ListingItem
                listingItemInitial={item}
                key={item.id}
                isLoadingSavedListings={savedListingsIsLoading}
                lazy={index >= EAGER_LISTING_ITEMS}
              />
            ))}
      </div>
      {numberOfPages > 1 && (
        <div className="mx-auto flex w-fit items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => handlePageChange(page - 1)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#4A5468] transition hover:bg-[#F1F5F9] disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Previous page"
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </button>
          {Array.from({ length: numberOfPages }, (_, i) => i + 1)
            .filter((p) => p === 1 || p === numberOfPages || Math.abs(p - page) <= 1)
            .reduce<(number | "…")[]>((acc, p, idx, arr) => {
              if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push("…");
              acc.push(p);
              return acc;
            }, [])
            .map((p, idx) =>
              p === "…" ? (
                <span key={`ellipsis-${idx}`} className="flex h-9 w-9 items-center justify-center text-sm text-[#717D96]">…</span>
              ) : (
                <button
                  key={p}
                  type="button"
                  onClick={() => handlePageChange(p as number)}
                  className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-semibold transition ${
                    page === p
                      ? "bg-[#1F5FD6] text-white"
                      : "text-[#4A5468] hover:bg-[#F1F5F9]"
                  }`}
                  aria-current={page === p ? "page" : undefined}
                >
                  {p}
                </button>
              ),
            )}
          <button
            type="button"
            disabled={page >= numberOfPages}
            onClick={() => handlePageChange(page + 1)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#4A5468] transition hover:bg-[#F1F5F9] disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Next page"
          >
            <ChevronRightIcon className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
};
