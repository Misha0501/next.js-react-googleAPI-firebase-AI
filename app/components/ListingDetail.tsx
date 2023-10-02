"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CheckCircleIcon,
  HeartIcon,
  PhotoIcon,
  Square3Stack3DIcon,
} from "@heroicons/react/24/outline";
import {
  BarChart,
  Button,
  Divider,
  Icon,
  LineChart,
  Title,
} from "@tremor/react";
import { GoBackBtn } from "./GoBackBtn";
import Image from "next/image";
import { useListingDetailPage } from "@/providers/Listing";
import { useParams } from "next/navigation";

import ListingAgentContactCard from "./ListingAgentContactCard";
import ListingContactAgentForm from "./ListingContactAgentForm";
import GoogleMap from "./GoogleMap";

import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import ListingDetailContent from "./ListingDetailContent";
import { useCreateRecentlyViewedListing } from "@/providers/RecentlyViewedListings";
import { useAuthContext } from "@/app/context/AuthContext";
import FloatingContactWidget from "./FloatingContactWidget";
import {
  BedRoomIcon,
  PhotosIcon,
  VerticaleMap,
  WindowsIcon,
} from "@/public/BedIcon";
import Link from "next/link";
import { Listing } from "@/types";

const ListingDetail = () => {
  const { authToken } = useAuthContext();
  const params = useParams();
  const listingId = Number(params?.id);
  const [showContactWithAgent, setShowContactWithAgent] = useState(false);
  const listingDetail = useListingDetailPage({ id: listingId });
  const [openLightBox, setOpenLightBox] = useState(false);
  const [lightBoxImageIndex, setLightBoxImageIndex] = useState(0);
  const createRecentlyViewedListing = useCreateRecentlyViewedListing({
    authToken,
  });
  const [
    averagePriceNeighborhoodChartData,
    setAveragePriceNeighborhoodChartData,
  ] = useState();
  console.log("listingDetail");
  console.log(listingDetail);
  console.log(listingDetail.data);

  useEffect(() => {
    if (listingDetail?.data?.averagePriceInNeighborhood) {
      setAveragePriceNeighborhoodChartData([
        {
          name: "Average price in the neighborhood",
          "Listing price": listingDetail?.data?.averagePriceInNeighborhood,
        },
        {
          name: "This listing's price",
          "Listing price": listingDetail?.data?.price,
        },
      ]);
    }
  }, [
    listingDetail?.data?.averagePriceInNeighborhood,
    listingDetail.isSuccess,
  ]);

  const dataFormatter = (number: number) => {
    return "€ " + Intl.NumberFormat("eu").format(number).toString();
  };

  let stats = useMemo(
    () => [
      {
        title: "Rooms",
        value: listingDetail?.data?.rooms,
        icon: Square3Stack3DIcon,
      },
      {
        title: "Bedrooms",
        value: listingDetail?.data?.bedrooms,
        icon: PhotoIcon,
      },
      {
        title: "Square Area",
        value: listingDetail?.data?.areaTotal,
        icon: PhotoIcon,
      },
      {
        title: "Status",
        value: listingDetail?.data?.active ? "Active" : "Suspend",
        icon: CheckCircleIcon,
      },
      {
        title: "More",
        value: listingDetail?.data?.active ? "Active" : "Suspend",
        icon: CheckCircleIcon,
      },
    ],
    [listingDetail?.data],
  );
  let generalInfo = useMemo(
    () => [
      { title: "Price", value: listingDetail.data?.price },
      { title: "Amount of Rooms", value: listingDetail.data?.rooms },
      { title: "Offered Since", value: listingDetail.data?.createdAt },
      { title: "Amount of bathrooms", value: listingDetail.data?.bathrooms },
      { title: "Status", value: listingDetail.data?.active },
      { title: "Amount of bedrooms", value: listingDetail.data?.bedrooms },
      { title: "Interior", value: listingDetail.data?.interiorType },
      { title: "Heating", value: listingDetail.data?.heatingType },
      { title: "Upkeep", value: listingDetail.data?.upkeepType },
      { title: "Parking area", value: listingDetail.data?.parking },
      { title: "Floor", value: listingDetail.data?.floorNumber },
      { title: "Balcony/terrace", value: listingDetail?.data?.balcony },
    ],
    [listingDetail?.data],
  );

  let areaAndCapacity = useMemo(
    () => [
      { title: "Total area", value: listingDetail.data?.areaTotal },
      { title: "Outside area", value: listingDetail.data?.areaOutside },
      { title: "Living area", value: listingDetail.data?.areaLiving },
      { title: "Garden", value: listingDetail.data?.areaGarden },
      { title: "Volume", value: listingDetail.data?.volume },
      { title: "Garage", value: listingDetail.data?.areaGarage },
    ],
    [listingDetail?.data],
  );

  let construction = useMemo(
    () => [
      { title: "Building type", value: listingDetail.data?.buildingType },
      { title: "Year built", value: listingDetail.data?.constructedYear },
      {
        title: "Number of Floor",
        value: listingDetail.data?.numberOfFloorsProperty,
      },
    ],
    [listingDetail?.data],
  );

  const generalInfoFunc = (val: any) => {
    console.log("Do nothing");
  };
  const similarAreaInfo = [
    {
      listingItem: {
        areaLiving: 400,
        savedListingId: true,
      },
      isLoadingSavedListings: false,
      onSavedIconClick: generalInfoFunc,
    },
    {
      listingItem: {
        areaLiving: 400,
        savedListingId: true,
      },
      isLoadingSavedListings: false,
      onSavedIconClick: generalInfoFunc,
    },
    {
      listingItem: {
        areaLiving: 400,
        savedListingId: true,
      },
      isLoadingSavedListings: false,
      onSavedIconClick: generalInfoFunc,
    },
  ];

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

  const slides = listingDetail?.data?.ListingImage.map((item) => ({
    src: item.url,
  }));

  return (
    <div className="mb-[68px] md:mb-0">
      <div className="mb-16 max-w-screen-xl m-auto">
        <Lightbox
          open={openLightBox}
          close={() => setOpenLightBox(false)}
          plugins={[Thumbnails]}
          slides={slides}
          index={lightBoxImageIndex}
        />
        <div className="pt-0 pb-11 md:pt-11">
          <GoBackBtn
            label="Back to results"
            className="text-black pl-5 pr-5 md:p-0 hidden md:flex"
          />
          <div className=" pt-0 md:pt-10">
            <div className="flex items-center justify-between">
              <h4 className="text-[40px] px-4 md:px-0 capitalize font-bold hidden md:block">
                {listingDetail?.data?.propertyType}
                {listingDetail?.data?.rooms
                  ? ` ${listingDetail?.data?.rooms} ROOMS`
                  : ""}
                {listingDetail?.data?.Address?.[0]?.locality
                  ? ` IN ${listingDetail?.data?.Address?.[0]?.locality?.toUpperCase()}`
                  : null}
                {listingDetail?.data?.listingType
                  ? ` FOR ${listingDetail?.data?.listingType}`
                  : null}
              </h4>
              {/*<div>*/}
              {/*    <Button*/}
              {/*        className="bg-[#f2f2f2]	text-black  border-0 mr-2"*/}
              {/*        icon={ShareIcon}*/}
              {/*    >*/}
              {/*        Share*/}
              {/*    </Button>*/}
              {/*    <Button*/}
              {/*        className="bg-[#f2f2f2]	text-black  border-0 mr-2"*/}
              {/*        icon={HeartIcon}*/}
              {/*    >*/}
              {/*        Favourite*/}
              {/*    </Button>*/}
              {/*    <Button className="px-16" icon={PrinterIcon}>*/}
              {/*        Print*/}
              {/*    </Button>*/}
              {/*</div>*/}
            </div>
            <p className="pt-2 px-4 md:px-0 text-[18px] text-[#848484] hidden md:block">
              {listingDetail?.data?.Address?.[0]?.route}
            </p>
            <div className=" relative pt-0 md:pt-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-4">
                {listingDetail?.data?.ListingImage?.[0]?.url && (
                  <div
                    onClick={() => handleOpenLightBox(0)}
                    className="col-span-2"
                  >
                    <Image
                      className={
                        "cursor-pointer object-cover h-full md:h-[480px] w-full  md:rounded-lg"
                      }
                      height={230}
                      width={380}
                      sizes="100vw"
                      src={listingDetail?.data?.ListingImage?.[0]?.url}
                      alt="property"
                      // fill={true}
                    />
                  </div>
                )}
                <div>
                  {listingDetail?.data?.ListingImage?.[1]?.url && (
                    <div
                      className="hidden md:block"
                      onClick={() => handleOpenLightBox(1)}
                    >
                      <Image
                        className={
                          "cursor-pointer object-cover h-[230px] w-full rounded-lg mb-[20px]"
                        }
                        height={230}
                        width={380}
                        src={listingDetail?.data?.ListingImage?.[1]?.url}
                        alt="property"
                      />
                    </div>
                  )}
                  {listingDetail?.data?.ListingImage?.[2]?.url && (
                    <div
                      className="hidden md:block"
                      onClick={() => handleOpenLightBox(2)}
                    >
                      <Image
                        className={
                          "cursor-pointer object-cover h-[230px] w-full rounded-lg"
                        }
                        height={230}
                        width={380}
                        src={listingDetail?.data?.ListingImage?.[2]?.url}
                        alt="property"
                        // placeholder="blur" // Optional blur-up while loading
                      />
                    </div>
                  )}
                </div>
              </div>
              {listingDetail?.data?.ListingImage?.[2]?.url && (
                <Button
                  onClick={() => setOpenLightBox(true)}
                  className="absolute bottom-6 right-6 text-white bg-[#97B6FF]  p-3 rounded-lg text-sm border-none  justify-center max-w-sm text-center hidden md:inline-flex"
                  icon={PhotoIcon}
                >
                  View all photos
                </Button>
              )}
            </div>

            {/* Mobile Resolution */}

            <div className="block md:hidden bg-[#F2F2F2] mb-4 border-b border-[#ccc]">
              {/* <Divider /> */}
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
            <div className="px-4 md:px-0 md:pt-8 ">
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
                <div className="md:col-span-2 ">
                  {/* Desktop Resolution */}
                  <div className="bg-[#f2f2f2] rounded-lg shadow-md  py-8  flex-col lg:flex-row items-center justify-between hidden md:flex">
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
                  <div className="block md:hidden py-2">
                    <div className="price_details flex justify-between">
                      <div>
                        <h2 className="text-2xl font-bold">
                          €{listingDetail.data?.price}{" "}
                          <small className="text-[#717D96] ml-2">
                            {listingDetail.data?.areaTotal}/m2
                          </small>
                        </h2>
                        <h3 className="text-[#717D96] text-xl font-bold mt-3">
                          {listingDetail?.data?.Address[0]?.locality}
                        </h3>
                        <div className="flex my-3">
                          <div className="flex items-center mr-3">
                            <WindowsIcon />
                            <p className="ml-2 text-[#717D96] text-base">
                              {listingDetail?.data?.areaTotal} m2
                            </p>
                          </div>
                          <div className="flex items-center">
                            <BedRoomIcon />
                            <p className="ml-2 text-[#717D96] text-base">
                              {listingDetail?.data?.bedrooms} bedrooms
                            </p>
                          </div>
                        </div>
                        <Link
                          href={`/users/${listingDetail?.data?.applicationUser?.id}`}
                        >
                          <p className="text-[#717D96] text-base">
                            {listingDetail?.data?.company?.name
                              ? listingDetail?.data?.company?.name
                              : listingDetail?.data?.applicationUser
                                  ?.displayName}
                          </p>
                        </Link>
                      </div>
                      <div>
                        <Icon
                          size="sm"
                          className="text-[#222222] border-2 border-solid border-[#222222]  rounded-full h-10 w-10 justify-center"
                          icon={HeartIcon}
                        />
                      </div>
                    </div>
                    <Divider className="mb-0 " />
                  </div>
                  <div className="pt-10 sm:pt-16">
                    <ListingDetailContent
                      areaAndCapacity={areaAndCapacity}
                      generalInfo={generalInfo}
                      construction={construction}
                      heatingType={listingDetail?.data?.heatingType}
                      description={listingDetail?.data?.description}
                    />
                  </div>
                  {listingDetail?.data?.Address[0].latitude && (
                    <div id="mapSection">
                      <Divider />
                      <p className="text-[24px] pb-8">View on map</p>
                      <GoogleMap
                        location={{
                          lat: parseFloat(
                            listingDetail?.data?.Address[0]?.latitude,
                          ),
                          lng: parseFloat(
                            listingDetail?.data?.Address[0]?.longitude,
                          ),
                          address: listingDetail?.data?.Address[0]?.locality,
                        }}
                      />
                      {/*<p className="text-[14] pt-8">See more results</p>*/}
                    </div>
                  )}
                </div>
                {listingDetail?.data && (
                  <div className="sm:col-span-1 md:col-span-1 lg:col-span-1">
                    <ListingAgentContactCard
                      showForm={setShowContactWithAgent}
                      listing={listingDetail?.data}
                    />
                    {showContactWithAgent && (
                      <ListingContactAgentForm name={"Sofia Jones"} />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="py-8 mt-16 bg-[#F2F2F2]">
        <div className="max-w-screen-xl m-auto px-4 md:px-0 md:pt-8">
          <p className="font-medium text-[24px]">Similar in this area</p>
          <div className="flex justify-normal gap-10 py-8 ">
            {similarAreaInfo.map((item, index) => (
              <div key={index} className="basis-1/3">
                <ListingItem
                  //@ts-ignore
                  listingItem={item.listingItem}
                  onSavedIconClick={item.onSavedIconClick}
                  isLoadingSavedListings={item.isLoadingSavedListings}
                />
              </div>
            ))}
          </div>
        </div>
      </div> */}

      {averagePriceNeighborhoodChartData && (
        <div className=" container">
          <p className="font-medium text-[24px] pt-14">
            Price comparison graph
          </p>
          <Title className="pt-8">
            This graph shows the average price in the neighborhood{" "}
            {listingDetail?.data?.Address[0]?.neighborhood} for properties with
            the same type compared to this listing.
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
      )}

      {/*<div className="py-8 mt-16 bg-[#F2F2F2]">*/}
      {/*    <div className="container">*/}
      {/*        <p className="font-medium text-[24px]">Similar in this area</p>*/}
      {/*        <div className="flex justify-normal gap-10 py-8 ">*/}
      {/*            {similarAreaInfo.map((item, index) => (*/}
      {/*                <div key={index} className="basis-1/3">*/}
      {/*                    <ListingItem*/}
      {/*                        listingItem={item.listingItem}*/}
      {/*                        onSavedIconClick={item.onSavedIconClick}*/}
      {/*                        isLoadingSavedListings={item.isLoadingSavedListings}*/}
      {/*                    />*/}
      {/*                </div>*/}
      {/*            ))}*/}
      {/*        </div>*/}
      {/*    </div>*/}
      {/*</div>*/}

      {listingDetail?.data?.ListingPrice?.length > 1 && (
        <div className="max-w-screen-xl m-auto px-4 md:px-0 md:pt-8 ">
          <p className="font-medium text-[24px] pt-14">Price change graph</p>
          <Title className="pt-8">
            This listing has changed its price{" "}
            {listingDetail?.data?.ListingPrice?.length} times
          </Title>
          <LineChart
            className="mt-6"
            data={listingDetail?.data?.ListingPrice || []}
            index="updatedAt"
            categories={["price"]}
            colors={["emerald"]}
          />
        </div>
      )}
      <FloatingContactWidget />
    </div>
  );
};

export default ListingDetail;
