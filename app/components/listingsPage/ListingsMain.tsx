"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ListingItem,
  ListingItemSkeleton,
} from "@/app/components/ListingItem";
import { usePropertyListing } from "@/providers/Listing";
import { useAuthContext } from "@/app/context/AuthContext";
import { Listing, SavedListing } from "@/types";
import { NO_MAX } from "@/app/lib/constants/filters";
import { Pagination } from "@mui/material";
import { useSavedListings } from "@/providers/SavedListings";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Props = {
  searchParams: any;
  listingType: string;
  locality: string;
};

const LISTINGS_PAGE_SIZE = 16;
const MAX_LISTINGS_PAGE = 1000000;
const EAGER_LISTING_ITEMS = 4;
const SKELETON_LISTING_ITEMS = 8;

const getPageFromSearchParams = (params: { get: (key: string) => string | null }) => {
  const page = Number(params.get("page"));
  return Number.isInteger(page) && page > 0 && page <= MAX_LISTINGS_PAGE
    ? page
    : 1;
};

export const ListingsMain = ({ searchParams, listingType, locality }: Props ) => {
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
  const { data: savedListingsData, isLoading: savedListingsIsLoading } = useSavedListings({ authToken });

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
    (event: React.ChangeEvent<unknown>, value: number) => {
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
    savedListingsListingIds = savedListings.map((el: SavedListing) => el.listingId);

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
      <p className={"text-red-500"}>
        Oops there was an error, please try again.
      </p>
    );
  }
  return (
    <div className="min-w-0 flex-1">
      <div className="flex flex-row justify-between">
        <>
          {isSuccess && (
            <div>
              <div className={"text-xl mb-12"}>
                <span className={"font-bold"}>Results: </span>{" "}
                <span>{listingsData?.total} properties found.</span>
              </div>
            </div>
          )}
        </>
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
        shape="rounded"
        count={numberOfPages}
        page={page}
        onChange={handlePageChange}
        variant="outlined"
        color="primary"
        className={"mx-auto w-fit"}
      />
    </div>
  );
};
