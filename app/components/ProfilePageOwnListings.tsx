"use client";

import { Listing } from "@/types";
import { ListingItem } from "@/app/components/ListingItem";

type Props = {
  listings: Listing[];
}
export const ProfilePageOwnListings = ({listings}: Props) => {
  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-3 gap-4">
        {listings && listings.map((listing) => (
          <ListingItem listingItem={listing} ></ListingItem>
        ))}
      </div>
    </div>
  );
};
