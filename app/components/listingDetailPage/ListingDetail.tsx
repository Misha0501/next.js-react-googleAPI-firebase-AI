"use client";

import { useEffect, useMemo, useState } from "react";
import { HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import { BarChart, Button, Divider, LineChart, Title } from "@tremor/react";
import { useListingDetailPage } from "@/providers/Listing";
import { useParams, useRouter } from "next/navigation";
import { ListingAgentContactCard } from "../ListingAgentContactCard";
import { ListingContactAgentForm } from "../ListingContactAgentForm";
import GoogleMap from "../GoogleMap";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import { ListingDetailContent } from "./ListingDetailContent";
import { useCreateRecentlyViewedListing } from "@/providers/RecentlyViewedListings";
import { useAuthContext } from "@/app/context/AuthContext";
import FloatingContactBar from "./FloatingContactBar";
import { ListingDetailImages } from "@/app/components/listingDetailPage/ListingDetailImages";
import {
  useCreateSavedListing,
  useDeleteSavedListing,
  useSavedListings,
} from "@/providers/SavedListings";
import { Listing, SavedListing } from "@/types";
import { toast } from "react-toastify";
import { Modal } from "@/app/components/Modal";
import { ListingMainInfo } from "@/app/components/listingDetailPage/ListingMainInfo";

const ListingDetail = () => {
  const { authToken } = useAuthContext();
  const params = useParams();
  const listingId = Number(params?.id);

  const [showContactWithAgent, setShowContactWithAgent] = useState(false);
  const listingDetail = useListingDetailPage({ id: listingId });
  const [openLightBox, setOpenLightBox] = useState(false);
  const [lightBoxImageIndex, setLightBoxImageIndex] = useState(0);
  let [showAuthModal, setShowAuthModal] = useState(false);
  const savedListings = useSavedListings({ authToken });
  const createRecentlyViewedListing = useCreateRecentlyViewedListing({
    authToken,
  });

  const [
    averagePriceNeighborhoodChartData,
    setAveragePriceNeighborhoodChartData,
  ] = useState();
  const createSavedListing = useCreateSavedListing({ authToken });
  const deleteSavedListing = useDeleteSavedListing({ authToken });

  const listing = useMemo(() => {
    if (listingDetail?.data) {
      return listingDetail.data;
    }
    return null;
  }, [listingDetail?.data]) as unknown as Listing;

  const { isListingSaved, savedListing } = useMemo(() => {
    if (savedListings?.data?.results) {
      const savedListing = savedListings.data.results.find(
        (savedListing: SavedListing) => savedListing.listingId === listingId,
      );

      return {
        isListingSaved: !!savedListing,
        savedListing,
      };
    }

    return {
      isListingSaved: false,
      savedListing: null,
    };
  }, [savedListings?.data, listingId]);

  const savedIconIsLoading = useMemo(
    () =>
      listingDetail.isLoading ||
      listingDetail.isFetching ||
      savedListings.isLoading ||
      savedListings.isFetching ||
      createSavedListing.isLoading ||
      deleteSavedListing.isLoading,
    [
      listingDetail.isLoading,
      listingDetail.isFetching,
      savedListings.isLoading,
      savedListings.isFetching,
      createSavedListing.isLoading,
      deleteSavedListing.isLoading,
    ],
  );

  useEffect(() => {
    if (listing?.averagePriceInNeighborhood) {
      // @ts-ignore
      setAveragePriceNeighborhoodChartData([
        {
          name: "Average price in the neighborhood",
          "Listing price": listing?.averagePriceInNeighborhood,
        },
        {
          name: "This listing's price",
          "Listing price": listing?.price,
        },
      ]);
    }
  }, [listing?.averagePriceInNeighborhood, listingDetail.isSuccess]);

  const router = useRouter();

  const dataFormatter = (number: number) => {
    return "€ " + Intl.NumberFormat("eu").format(number).toString();
  };

  const handleSavedIconClick = async () => {
    // if user is not logged in show the auth modal
    if (!authToken) {
      setShowAuthModal(true);
      return;
    }

    try {
      if (!isListingSaved) {
        // if listings isn't saved do a post request to save it
        await createSavedListing.mutateAsync({
          listingId,
        });
      } else {
        // if it's saved do a delete request
        await deleteSavedListing.mutateAsync({ id: savedListing.id });
      }
      await savedListings.refetch();
    } catch (error) {
      toast.error("Oops! Something went wrong. Please try again later.");
    }
  };

  useEffect(() => {
    // Create recently viewed listing if user is logged in
    if (listingDetail.isSuccess && authToken) {
      createRecentlyViewedListing.mutate({
        listingId: listingId,
      });
    }
  }, [authToken, listingDetail.isSuccess, listingId]);

  const handleOpenLightBox = (index: number) => {
    setLightBoxImageIndex(index);
    setOpenLightBox(true);
  };

  const handleContactAgentClick = () => {
    setShowContactWithAgent(true);
    // navigate to the contact form
    router.push("#contactAgentForm");
  };

  const slides = listing?.ListingImage.map((item) => ({
    src: item.url,
  }));

  let contactNumber =
    listing?.company?.phoneNumber ??
    listing?.applicationUser?.phoneNumber ??
    "";

  return (
    <div className="pb-32 lg:pb-10">
      <div className="container">
        <Lightbox
          open={openLightBox}
          close={() => setOpenLightBox(false)}
          plugins={[Thumbnails]}
          slides={slides}
          index={lightBoxImageIndex}
        />
        <div className="pt-8 lg:pt-10">
          <div className="flex items-center justify-between">
            <div className="">
              <h1 className="capitalize font-bold text-3xl">
                {listing?.propertyType}
                {listing?.rooms ? ` ${listing?.rooms} ROOMS` : ""}
                {listing?.Address?.[0]?.locality
                  ? ` IN ${listing?.Address?.[0]?.locality?.toUpperCase()}`
                  : null}
                {listing?.listingType ? ` FOR ${listing?.listingType}` : null}
              </h1>
              <p className="pt-2 lg:px-0 text-[18px] text-[#848484] mb-3">
                {listing?.Address?.[0]?.route}
              </p>
            </div>
            <Button
              icon={isListingSaved ? HeartIconSolid : HeartIcon}
              variant={"secondary"}
              loading={savedIconIsLoading}
              className={"hidden lg:flex"}
              onClick={handleSavedIconClick}
              data-testid="favouriteButton"
            >
              Favourite
            </Button>
          </div>

          <div className="mt-0 lg:mt-8 lg:mb-4">
            <ListingDetailImages
              images={listing?.ListingImage || []}
              handleOpenLightBox={handleOpenLightBox}
            />
          </div>
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
            <div className="lg:col-span-2 ">
              <ListingMainInfo listing={listing} />

              <div className="pt-10 sm:pt-16">
                <ListingDetailContent listing={listing} />
              </div>
              <Divider className="hidden lg:block" />
              {listing?.Address[0].latitude && (
                <div id="mapSection">
                  <p className="text-2xl pb-8">View on map</p>
                  <GoogleMap
                    data-testid={"map"}
                    location={{
                      lat: parseFloat(listing?.Address[0]?.latitude),
                      lng: parseFloat(listing?.Address[0]?.longitude),
                      address: listing?.Address[0]?.locality,
                    }}
                  />
                </div>
              )}
            </div>
            <div className="sm:col-span-1 lg:col-span-1 lg:col-span-1">
              <ListingAgentContactCard
                showContactForm={handleContactAgentClick}
                listing={listing}
              />
              {showContactWithAgent && (
                <div id={"contactAgentForm"} data-testid={"contactAgentForm"}>
                  <ListingContactAgentForm
                    name={
                      listing?.company?.name ||
                      listing?.applicationUser?.displayName
                    }
                    emailTo={
                      listing?.company?.email || listing?.applicationUser?.email
                    }
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {averagePriceNeighborhoodChartData && (
        <div className={"py-12"}>
          <div className="container">
            <p className="font-medium text-[24px]">Price comparison graph</p>
            <Title className="pt-8">
              This graph shows the average price in the neighborhood{" "}
              {listing?.Address[0]?.neighborhood} for properties with the same
              type compared to this listing.
            </Title>
            <BarChart
              className="mt-6"
              data={averagePriceNeighborhoodChartData}
              index="name"
              categories={["Listing price"]}
              colors={["blue"]}
              valueFormatter={dataFormatter}
              yAxisWidth={48}
              data-testid={"averagePriceNeighborhoodChart"}
            />
          </div>
        </div>
      )}

      {listing?.ListingPrice?.length > 1 && (
        <div className="lg:pt-8">
          <div className="container">
            <p className="font-medium text-[24px] pt-14">Price change graph</p>
            <Title className="pt-8">
              This listing has changed its price {listing?.ListingPrice?.length}{" "}
              times
            </Title>
            <LineChart
              className="mt-6"
              data={listing?.ListingPrice || []}
              index="updatedAt"
              categories={["price"]}
              colors={["emerald"]}
              data-testid={"priceChangeGraph"}
            />
          </div>
        </div>
      )}
      <FloatingContactBar
        phoneNumber={contactNumber}
        onContactClick={handleContactAgentClick}
      />

      <Modal
        title={"To save property please log in or create an account."}
        show={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onCancelClick={() => setShowAuthModal(false)}
        onSubmitClick={() => router.push("/signin")}
      />
    </div>
  );
};

export default ListingDetail;
