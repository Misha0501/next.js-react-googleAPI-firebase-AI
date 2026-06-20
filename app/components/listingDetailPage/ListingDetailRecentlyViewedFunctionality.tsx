"use client";

import { useEffect } from "react";
import { useCreateRecentlyViewedListing } from "@/providers/RecentlyViewedListings";
import { useAuthContext } from "@/app/context/AuthContext";

type Props = {
  listingId: number;
};
export const ListingDetailRecentlyViewedFunctionality = ({
  listingId,
}: Props) => {
  const { isAuthenticated } = useAuthContext();

  const { mutate: createRecentlyViewedListing } =
    useCreateRecentlyViewedListing();

  useEffect(() => {
    // Create recently viewed listing if user is logged in
    if (listingId && isAuthenticated) {
      createRecentlyViewedListing({
        listingId,
      });
    }
  }, [isAuthenticated, createRecentlyViewedListing, listingId]);

  return null;
};
