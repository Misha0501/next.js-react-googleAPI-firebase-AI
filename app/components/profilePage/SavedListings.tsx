"use client";

import { useMemo } from "react";
import { ListingItem } from "@/app/components/ListingItem";
import { useAuthContext } from "@/app/context/AuthContext";
import { SavedListing } from "@/types";
import { useSavedListings } from "@/providers/SavedListings";
import { CircularProgress } from "@mui/material";
import Link from "next/link";
import { Button } from "@tremor/react";

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

  if (isLoading) return <CircularProgress />;
  if (error)
    return (
      <p className={"mt-10 text-red-500"}>
        Oops something went wrong please try again later
      </p>
    );

  return (
    <div className="mt-10 w-full">
      <div>
        {savedListings && savedListings.length > 0 && (
          <div className="flex justify-between items-baseline">
            <div className="text-xl">
              <span className={"font-bold"}>Results: </span>{" "}
              {savedListingsData?.total}{" "}
              {savedListingsData?.total === 0 || savedListingsData?.total > 1
                ? "properties"
                : "property"}{" "}
              saved
            </div>
          </div>
        )}

        <div className={"grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8 mt-10"}>
          {savedListings &&
            savedListings.map((item: SavedListing, index) => (
              <ListingItem
                listingItemInitial={item.listing}
                key={index}
                onStateChanged={refetch}
              />
            ))}
        </div>
        {savedListings && !savedListings.length && (
          <div>
            <p className="text-gray-500 mb-4">
              You haven&apos;t saved any properties yet
            </p>
            <Link href={`/listings`}>
              <Button>Browse properties</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
