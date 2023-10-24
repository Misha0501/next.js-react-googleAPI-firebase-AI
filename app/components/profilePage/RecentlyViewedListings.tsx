"use client";
import { useEffect, useState } from "react";
import { useAuthContext } from "@/app/context/AuthContext";
import { RecentlyViewedListing } from "@/types";
import { ListingItem } from "@/app/components/ListingItem";
import { useRecentlyViewedListings } from "@/providers/RecentlyViewedListings";
import { useSavedListings } from "@/providers/SavedListings";
import { getPopulatedListingsSaved } from "@/app/lib/listing/getPopulatedListingsSaved";
import Link from "next/link";
import { Button } from "@tremor/react";

export const RecentlyViewedListings = () => {
  const { authToken } = useAuthContext();
  const [recentlyViewedListings, setRecentlyViewedListings] = useState<
    RecentlyViewedListing[]
  >([]);
  const [populatedListings, setPopulatedListings] = useState([]);
  const recentlyViewedListingsResponse = useRecentlyViewedListings({
    authToken,
  });
  const savedListings = useSavedListings({ authToken });

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
    <div className="mt-6 lg:mt-10 w-full">
      {recentlyViewedListingsResponse.isLoading && <p>Loading...</p>}
      {recentlyViewedListingsResponse.isError && (
        <p>Oops! Something went wrong. Please try again.</p>
      )}
      {!recentlyViewedListingsResponse.isLoading &&
        !recentlyViewedListingsResponse.isError && (
          <div>
            <div
              className={"grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8 mt-10"}
            >
              {populatedListings &&
                populatedListings.map((item, index) => (
                  <ListingItem listingItemInitial={item} key={index} />
                ))}
            </div>

            {populatedListings && !populatedListings.length && (
              <div>
                <p className="text-gray-500 mb-4">
                  You haven&apos;t viewed any properties yet
                </p>
                <Link href={`/listings`}>
                  <Button>Browse properties</Button>
                </Link>
              </div>
            )}
          </div>
        )}
    </div>
  );
};
