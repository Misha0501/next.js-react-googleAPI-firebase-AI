"use client";
import { useEffect, useMemo, useState } from "react";
import { ListingItem } from "@/app/components/ListingItem";
import { usePropertyListing } from "@/providers/Listing";
import { useAuthContext } from "@/app/context/AuthContext";
import { Listing, SavedListing } from "@/types";
import { NO_MAX } from "@/app/lib/constants/filters";
import { CircularProgress, Pagination } from "@mui/material";
import { useSavedListings } from "@/providers/SavedListings";

type Props = {
  searchParams: any;
  listingType: string;
  locality: string;
};

export const ListingsMain = ({ searchParams, listingType, locality }: Props ) => {
  const { authToken } = useAuthContext();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
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

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number,
  ) => {
    setPage(value);
  };

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
    if (!listingsData) return;
    // Assing pages related variables
    setPage(listingsData?.page);
  }, [listingsData]);


  if (isError) {
    return (
      <p className={"text-red-500"}>
        Oops there was an error, please try again.
      </p>
    );
  }
  return (
    <div className="w-full">
      <div className="flex flex-row justify-between">
        <>
          {isLoading && <CircularProgress />}
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
      <div className={"grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-16 mb-12"}>
        {populatedListings.map((item, index) => (
          <ListingItem listingItemInitial={item} key={item.id} isLoadingSavedListings={savedListingsIsLoading}/>
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
