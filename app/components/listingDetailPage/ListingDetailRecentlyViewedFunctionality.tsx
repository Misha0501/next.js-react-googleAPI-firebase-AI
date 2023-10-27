"use client";

import { useEffect } from "react";
import { useCreateRecentlyViewedListing } from "@/providers/RecentlyViewedListings";
import { useAuthContext } from "@/app/context/AuthContext";

type Props = {
  listingId: number;
};
export const ListingDetailRecentlyViewedFunctionality = ({ listingId }: Props) => {
  const { authToken } = useAuthContext();

  const createRecentlyViewedListing = useCreateRecentlyViewedListing({
    authToken,
  });

  useEffect(() => {
    // Create recently viewed listing if user is logged in
    if (listingId && authToken) {
      createRecentlyViewedListing.mutate({
        listingId,
      });
    }
  }, [authToken, listingId]);

  return null;
};
