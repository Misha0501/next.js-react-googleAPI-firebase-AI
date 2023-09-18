"use client";
import { useEffect, useState } from "react";
import { ListingItem } from "@/app/components/ListingItem";
import { usePropertyListing } from "@/providers/Listing";
import { useAuthContext } from "@/app/context/AuthContext";
import { Listing, SavedListing } from "@/types";
import { getFetchUrl } from "@/app/lib/getFetchUrl";
import { NO_MAX } from "../Constants/filters";
import { CircularProgress, Pagination } from "@mui/material";

export const ListingsMain = ({ searchParams, listingType, locality }) => {
  const { authToken } = useAuthContext();
  const [populatedListings, setPopulatedListings] = useState<Listing[]>([]);
  // const [isLoadingListings, setIsLoadingListings] = useState(true);
  const [isLoadingSavedListings, setIsLoadingSavedListings] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [numberOfPages, setNumberOfPages] = useState(0);
  const [totalListings, setTotalListings] = useState(0);
  const [sortBy, setSortBy] = useState(undefined);

  const propertyListing = usePropertyListing({
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

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  }

  const handleSavedIconClick = (listing: Listing) => {
    // if listings isn't saved we do a post request to save it
    if (!listing.savedListingId) {
      fetch(getFetchUrl(`/api/savedListings`), {
        method: "POST",
        cache: "no-store",
        headers: {
          "Content-type": "application/json",
          Authorization: authToken,
        },
        body: JSON.stringify({ listingId: listing.id }),
      })
        .then((response) => response.json())
        .then((savedListing: SavedListing) => {
          // populate current listings with updated data
          const updatedListings = populatedListings.map((item) => {
            if (item.id === listing.id) {
              item.savedListingId = savedListing.id;
            }
            return item;
          });
          setPopulatedListings([...updatedListings]);
        })
        .catch((error) => {
          console.error(error);
          console.error(error.message);
        });
    } else {
      // if it's saved we do a delete request
      if (!listing.savedListingId) return;

      fetch(getFetchUrl(`/api/savedListings/${listing.savedListingId}`), {
        method: "DELETE",
        cache: "no-store",
        headers: {
          "Content-type": "application/json",
          Authorization: authToken,
        },
      })
        .then(() => {
          const updatedListings = populatedListings.map((item) => {
            if (item.savedListingId === listing.savedListingId) {
              item.savedListingId = null;
            }
            return item;
          });
          setPopulatedListings([...updatedListings]);
        })
        .catch((error) => {
          console.error(error.message);
        });
    }
  };
  const updateListingsWithSavedFeature = async (listings: Listing[]) => {
    // get the data from the api
    const response = await fetch(getFetchUrl(`/api/savedListings`), {
      method: "GET",
      cache: "no-store",
      headers: {
        "Content-type": "application/json",
        Authorization: authToken,
      },
    });
    // convert the data to json
    const data = await response.json();

    let savedListings: SavedListing[] = data.results;
    let savedListingsListingIds: number[] = [];

    // Store all savedListing's listingIds
    if (savedListings) {
      savedListingsListingIds = savedListings.map((el) => el.listingId);
    }

    // populate listings with saved listings data
    const populatedListingsWithSavedListingData = listings.map((listing) => {
      const savedListingListingId = savedListingsListingIds.find(
        (savedListingId) => savedListingId === listing.id
      );
      const savedListing = savedListings.find(
        (savedListing: SavedListing) =>
          savedListing.listingId === savedListingListingId
      );

      if (savedListingListingId && savedListingListingId && savedListing) {
        listing.savedListingId = savedListing.id;
      } else {
        listing.savedListingId = undefined;
      }
      return listing;
    });

    setPopulatedListings([...populatedListingsWithSavedListingData]);
    setIsLoadingSavedListings(false);
  };

  useEffect(() => {
    if (propertyListing.isSuccess) {
      // Fetch saved icons
      const listings = propertyListing.data.results;

      setTotalListings(propertyListing.data.total);
      setPage(propertyListing.data.page);
      // Calculate and set number of pages
      setNumberOfPages(Math.ceil(propertyListing.data.total / pageSize));

      updateListingsWithSavedFeature(listings).catch((e) => {
        console.error("Error fetching saved listings: ", e);
        // if saved listings aren't fetched we still want to display the listings
        setPopulatedListings(listings);
        setIsLoadingSavedListings(false);
      });
    }
  }, [propertyListing?.data?.results, page]);

  if (propertyListing.isFetching) {
    return <CircularProgress />;
  }
  if (propertyListing?.isError) {
    return <p>{propertyListing?.error?.message}</p>;
  }

  return (
    <div className="w-full">
      <div className="flex flex-row justify-between">
        {!propertyListing?.error && !propertyListing?.isFetching && (
          <>
            <div>
              <div className={"text-xl mb-12"}>
                <span className={"font-bold"}>Results: </span>{" "}
                <span>{totalListings} properties found.</span>
              </div>
            </div>
            {/*<Select*/}
            {/*  style={{ width: "300px" }}*/}
            {/*  onValueChange={(e) => setSortBy(e)}*/}
            {/*>*/}
            {/*  {sortOption.map((el, index) => (*/}
            {/*    <SelectItem value={el} key={index}></SelectItem>*/}
            {/*  ))}*/}
            {/*</Select>*/}
          </>
        )}
      </div>
      <div className={"grid grid-cols-2 gap-16 mb-12"}>
        {populatedListings &&
          populatedListings.map((item, index) => (
            <ListingItem
              listingItem={item}
              key={index}
              onSavedIconClick={handleSavedIconClick}
              isLoadingSavedListings={isLoadingSavedListings}
            />
          ))}
      </div>
      <Pagination shape="rounded" count={numberOfPages} page={page} onChange={handlePageChange} variant="outlined" color="primary" className={"mx-auto w-fit"} />
    </div>
  );
};
