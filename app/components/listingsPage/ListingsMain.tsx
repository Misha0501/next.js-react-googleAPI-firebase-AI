"use client";
import { useCallback, useMemo } from "react";
import { ListingItem, ListingItemSkeleton } from "@/app/components/ListingItem";
import { usePropertyListing } from "@/providers/Listing";
import { useAuthContext } from "@/app/context/AuthContext";
import { Listing } from "@/types";
import { NO_MAX } from "@/app/lib/constants/filters";
import type { FilterValues } from "@/app/components/listingsPage/Filters";
import { Pagination } from "@/app/components/shared/Pagination";
import { useSavedListingIds } from "@/providers/SavedListings";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Props = {
  searchParams: FilterValues;
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
  const page = currentUrlPage;
  const pageSize = LISTINGS_PAGE_SIZE;
  const sortBy = urlSearchParams.get("sortBy") || undefined;
  const { data: savedListingIds, isLoading: savedListingsIsLoading } =
    useSavedListingIds({ authToken });

  const {
    data: listingsData,
    isLoading,
    isError,
    isSuccess,
  } = usePropertyListing({
    priceMin: searchParams.priceRange.min,
    priceMax:
      searchParams.priceRange.max === NO_MAX
        ? undefined
        : searchParams.priceRange.max,
    listedSince: searchParams.listedSince,
    areaLivingMin: searchParams.livingAreaRange.min,
    areaLivingMax:
      searchParams.livingAreaRange.max === NO_MAX
        ? undefined
        : searchParams.livingAreaRange.max,
    areaTotalMin: searchParams.areaTotal.min,
    areaTotalMax:
      searchParams.areaTotal.max === NO_MAX
        ? undefined
        : searchParams.areaTotal.max,
    roomsMin: searchParams.roomRange.min,
    roomsMax:
      searchParams.roomRange.max === NO_MAX
        ? undefined
        : searchParams.roomRange.max,
    bedroomsMin: searchParams.bedroomRange.min,
    bedroomsMax:
      searchParams.bedroomRange.max === NO_MAX
        ? undefined
        : searchParams.bedroomRange.max,
    propertyType: searchParams.propertyType,
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
      updatePageUrl(value);
    },
    [updatePageUrl],
  );

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
    if (!listings?.length) return [];
    if (!savedListingIds?.length) return listings;

    const savedMap = new Map(savedListingIds.map((s) => [s.listingId, s.id]));
    const populatedListings = listings.map((listing: Listing) => ({
      ...listing,
      savedListingId: savedMap.get(listing.id),
    }));
    return populatedListings;
  }, [savedListingIds, listings]);

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
      <Pagination
        page={page}
        totalPages={numberOfPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};
