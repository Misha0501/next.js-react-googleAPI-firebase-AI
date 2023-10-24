"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ClockIcon,
  HeartIcon,
  Square3Stack3DIcon,
} from "@heroicons/react/24/outline";

import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import {
  BarChart,
  Button,
  Divider,
  Icon,
  LineChart,
  Title,
} from "@tremor/react";
import { useListingDetailPage } from "@/providers/Listing";
import { useParams, useRouter } from "next/navigation";

import { ListingAgentContactCard } from "../ListingAgentContactCard";
import { ListingContactAgentForm } from "../ListingContactAgentForm";
import GoogleMap from "../GoogleMap";

import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import ListingDetailContent from "./ListingDetailContent";
import { useCreateRecentlyViewedListing } from "@/providers/RecentlyViewedListings";
import { useAuthContext } from "@/app/context/AuthContext";
import FloatingContactBar from "../FloatingContactBar";
import {
  BedIcon,
  BedRoomIcon,
  PhotosIcon,
  VerticaleMap,
  WindowsIcon,
} from "@/public/BedIcon";
import Link from "next/link";
import { GridIcon } from "@/public/GridIcon";
import { formatToDayAndMonthWithName } from "@/app/lib/formatToDayAndMonthWithName";
import { ListingDetailImages } from "@/app/components/listingDetailPage/ListingDetailImages";
import {
  useCreateSavedListing,
  useDeleteSavedListing,
  useSavedListings,
} from "@/providers/SavedListings";
import { SavedListing } from "@/types";
import { toast } from "react-toastify";
import { Modal } from "@/app/components/Modal";
import { CircularProgress } from "@mui/material";

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
  }, [listingDetail?.data]);

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
      deleteSavedListing.isLoading
    ]
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

  let stats = useMemo(
    () => [
      {
        title: "Rooms",
        value: listing?.rooms,
        icon: Square3Stack3DIcon,
      },
      {
        title: "Bedrooms",
        value: listing?.bedrooms,
        icon: BedIcon,
      },
      {
        title: "Square Area",
        value: listing?.areaTotal,
        icon: GridIcon,
      },
      {
        title: "Offered since",
        value: formatToDayAndMonthWithName(listing?.createdAt ?? ""),
        icon: ClockIcon,
      },
    ],
    [listing],
  );

  let generalInfo = useMemo(
    () => [
      { title: "Price", value: listing?.price },
      { title: "Amount of Rooms", value: listing?.rooms },
      { title: "Offered Since", value: listing?.createdAt },
      { title: "Amount of bathrooms", value: listing?.bathrooms },
      { title: "Status", value: listing?.active },
      { title: "Amount of bedrooms", value: listing?.bedrooms },
      { title: "Interior", value: listing?.interiorType },
      { title: "Heating", value: listing?.heatingType },
      { title: "Upkeep", value: listing?.upkeepType },
      { title: "Parking area", value: listing?.parking },
      { title: "Floor", value: listing?.floorNumber },
      { title: "Balcony/terrace", value: listing?.balcony },
    ],
    [listingDetail?.data],
  );

  let areaAndCapacity = useMemo(
    () => [
      { title: "Total area", value: listing?.areaTotal },
      { title: "Outside area", value: listing?.areaOutside },
      { title: "Living area", value: listing?.areaLiving },
      { title: "Garden", value: listing?.areaGarden },
      { title: "Volume", value: listing?.volume },
      { title: "Garage", value: listing?.areaGarage },
    ],
    [listingDetail?.data],
  );

  let construction = useMemo(
    () => [
      { title: "Building type", value: listing?.buildingType },
      { title: "Year built", value: listing?.constructedYear },
      {
        title: "Number of Floor",
        value: listing?.numberOfFloorsProperty,
      },
    ],
    [listingDetail?.data],
  );

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

          {/* Mobile Resolution */}
          <div className="block lg:hidden bg-[#F2F2F2] mb-4 border-b border-[#ccc]">
            <div className="flex justify-around py-4">
              <div className="photos">
                <Button
                  icon={PhotosIcon}
                  onClick={() => setOpenLightBox(true)}
                  className="flex gap-1 p-0 bg-transparent border-0 text-tremor-brand-textPrimary font-bold hover:bg-transparent"
                >
                  Photos
                </Button>
              </div>
              <div className="map">
                <Link href={"#mapSection"}>
                  <Button
                    icon={VerticaleMap}
                    className="flex gap-1 p-0 bg-transparent border-0 text-tremor-brand-textPrimary font-bold hover:bg-transparent"
                  >
                    Location
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
            <div className="lg:col-span-2 ">
              {/* Desktop Resolution */}
              <div className="bg-[#f2f2f2] rounded-lg shadow-md  py-8  flex-col lg:flex-row items-center justify-between hidden lg:flex">
                {stats?.map((el, index) => (
                  <div
                    key={index}
                    className="flex flex-row lg:flex-col items-center justify-between w-full sm:border-1"
                  >
                    <p className="text-[16px] text-[#616161]">{el.title}</p>
                    <div className="flex items-center pt-2 sm:pt-4">
                      <Icon
                        className="text-[#616161]"
                        size="lg"
                        icon={el.icon}
                      />
                      <p className="pl-2 text-[16px] text-[#616161]">
                        {el.value || "-"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              {/* Mobile Resolution */}
              <div className="block lg:hidden py-2">
                <div className="price_details flex justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">
                      €{listing?.price}{" "}
                      <small className="text-[#717D96] ml-2">
                        {listing?.areaTotal}/m2
                      </small>
                    </h2>
                    <h3 className="text-[#717D96] text-xl font-bold mt-3">
                      {listing?.Address[0]?.locality}
                    </h3>
                    <div className="flex my-3">
                      <div className="flex items-center mr-3">
                        <WindowsIcon />
                        <p className="ml-2 text-[#717D96] text-base">
                          {listing?.areaTotal} m2
                        </p>
                      </div>
                      <div className="flex items-center">
                        <BedRoomIcon />
                        <p className="ml-2 text-[#717D96] text-base">
                          {listing?.bedrooms} bedrooms
                        </p>
                      </div>
                    </div>
                    <Link href={`/users/${listing?.applicationUser?.id}`}>
                      <p className="text-[#717D96] text-base">
                        {listing?.company?.name
                          ? listing?.company?.name
                          : listing?.applicationUser?.displayName}
                      </p>
                    </Link>
                  </div>
                  <div>
                    {savedIconIsLoading ? <CircularProgress size={28} /> :
                      <Icon
                        size="sm"
                        onClick={handleSavedIconClick}
                        className="text-gray-500 border border-solid border-gray-500 rounded-full h-10 w-10 justify-center hover:cursor-pointer"
                        icon={isListingSaved ? HeartIconSolid : HeartIcon}
                      />
                    }
                  </div>
                </div>
                <Divider className="mb-0 " />
              </div>
              <div className="pt-10 sm:pt-16">
                <ListingDetailContent
                  areaAndCapacity={areaAndCapacity}
                  generalInfo={generalInfo}
                  construction={construction}
                  heatingType={listing?.heatingType}
                  description={listing?.description}
                />
              </div>
              {listing?.Address[0].latitude && (
                <div id="mapSection">
                  <p className="text-[24px] pb-8">View on map</p>
                  <GoogleMap
                    location={{
                      lat: parseFloat(listing?.Address[0]?.latitude),
                      lng: parseFloat(listing?.Address[0]?.longitude),
                      address: listing?.Address[0]?.locality,
                    }}
                  />
                  {/*<p className="text-[14] pt-8">See more results</p>*/}
                </div>
              )}
            </div>
            {listing && (
              <div className="sm:col-span-1 lg:col-span-1 lg:col-span-1">
                <ListingAgentContactCard
                  showForm={handleContactAgentClick}
                  listing={listing}
                />
                {showContactWithAgent && (
                  <div id={"contactAgentForm"}>
                    <ListingContactAgentForm
                      name={
                        listing?.company?.name ||
                        listing?.applicationUser?.displayName
                      }
                      emailTo={
                        listing?.company?.email ||
                        listing?.applicationUser?.email
                      }
                    />
                  </div>
                )}
              </div>
            )}
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
