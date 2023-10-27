"use client";

import { useEffect, useMemo } from "react";
import { Divider } from "@tremor/react";
import { useListingDetailPage } from "@/providers/Listing";
import { useParams } from "next/navigation";
import { ListingAgentContactCard } from "../ListingAgentContactCard";
import { ListingDetailContent } from "./ListingDetailContent";
import { useCreateRecentlyViewedListing } from "@/providers/RecentlyViewedListings";
import { useAuthContext } from "@/app/context/AuthContext";
import FloatingContactBar from "./FloatingContactBar";
import { ListingDetailImages } from "@/app/components/listingDetailPage/ListingDetailImages";
import { Listing } from "@/types";
import { ListingMainInfo } from "@/app/components/listingDetailPage/ListingMainInfo";
import { PriceComparisonGraphSection } from "@/app/components/listingDetailPage/PriceComparisonGraphSection";
import { PriceChangeGraphSection } from "@/app/components/listingDetailPage/PriceChangeGraphSection";
import { MapsSection } from "@/app/components/listingDetailPage/MapsSection";
import { ListingTitleSection } from "@/app/components/listingDetailPage/ListingTitleSection";
import { ListingDetailSavedButton } from "@/app/components/listingDetailPage/ListingDetailSavedButton";

const ListingDetail = () => {
  const { authToken } = useAuthContext();
  const params = useParams();
  const listingId = Number(params?.id);

  const listingDetail = useListingDetailPage({ id: listingId });

  const createRecentlyViewedListing = useCreateRecentlyViewedListing({
    authToken,
  });

  const listing = useMemo(() => {
    if (listingDetail?.data) {
      return listingDetail.data;
    }
    return null;
  }, [listingDetail?.data]) as unknown as Listing;

  useEffect(() => {
    // Create recently viewed listing if user is logged in
    if (listingDetail.isSuccess && authToken) {
      createRecentlyViewedListing.mutate({
        listingId: listingId,
      });
    }
  }, [authToken, listingDetail.isSuccess, listingId]);

  let contactNumber =
    listing?.company?.phoneNumber ??
    listing?.applicationUser?.phoneNumber ??
    "";

  return (
    <div className="pb-32 lg:pb-10">
      <div className="container">
        <div className="pt-8 lg:pt-10">
          <div className="flex items-center justify-between">
            <ListingTitleSection listing={listing} />

            <div>
              <ListingDetailSavedButton listingId={listingId} />
            </div>
          </div>

          <div className="mt-0 lg:mt-8 lg:mb-4">
            <ListingDetailImages images={listing?.ListingImage || []} />
          </div>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
            <div className="lg:col-span-2">
              <ListingMainInfo listing={listing} />

              <ListingDetailContent listing={listing} />

              <Divider className="hidden lg:block" />

              <MapsSection address={listing?.Address?.[0]} />
            </div>

            <div className="col-span-1 lg:col-span-1">
              <ListingAgentContactCard listing={listing} />
            </div>
          </div>
        </div>
      </div>

      <PriceComparisonGraphSection listing={listing} />

      <PriceChangeGraphSection listingPriceArray={listing?.ListingPrice} />

      <FloatingContactBar
        phoneNumber={contactNumber}
        onContactClick={() => {
          alert("TODO: implement this function");
        }}
      />
    </div>
  );
};

export default ListingDetail;
