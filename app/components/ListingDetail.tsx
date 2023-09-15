"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ShareIcon,
  HeartIcon,
  PrinterIcon,
  CheckCircleIcon,
  Square3Stack3DIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
import { Button, Icon, Metric, Text } from "@tremor/react";
import { GoBackBtn } from "./GoBackBtn";
import { Divider } from "@tremor/react";
import { Card, Title, LineChart } from "@tremor/react";
import Image from "next/image";
import { useListingDetailPage } from "@/providers/Listing";
import { useParams } from "next/navigation";

import ListingAgentContactCard from "./ListingAgentContactCard";
import ListingContactAgentForm from "./ListingContactAgentForm";
import { ListingItem } from "./ListingItem";
import GoogleMap from "./GoogleMap";

import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import ListingDetailContent from "./ListingDetailContent";

const ListingDetail = () => {
  const params = useParams();
  const [showContactWithAgent, setShowContactWithAgent] = useState(false);
  const listingDetail = useListingDetailPage({ id: Number(params?.id) });
  const [openLightBox, setOpenLightBox] = useState(false);

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
    [listingDetail?.data]
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
    [listingDetail?.data]
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
    [listingDetail?.data]
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
    [listingDetail?.data]
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

  const slides = listingDetail?.data?.ListingImage.map((item) => ({
    src: item.url,
  }));

    return (
        <div className="mb-16">
            <Lightbox
                open={openLightBox}
                close={() => setOpenLightBox(false)}
                plugins={[Thumbnails]}
                slides={slides}
            />

            <div className="container">
                <div className="py-11">
                    <GoBackBtn label="Back to results" className="text-black"/>
                    <div className="pt-10">
                        <div className="flex items-center justify-between">
                            <h4 className="text-[40px] capitalize font-bold">
                                {listingDetail?.data?.propertyType}
                                {listingDetail?.data?.rooms
                                    ? ` ${listingDetail?.data?.rooms} ROOMS`
                                    : ""}
                                {listingDetail?.data?.listingType
                                    ? ` FOR ${listingDetail?.data?.listingType}`
                                    : null}
                            </h4>
                            <div>
                                <Button
                                    className="bg-[#f2f2f2]	text-black  border-0 mr-2"
                                    icon={ShareIcon}
                                >
                                    Share
                                </Button>
                                <Button
                                    className="bg-[#f2f2f2]	text-black  border-0 mr-2"
                                    icon={HeartIcon}
                                >
                                    Favourite
                                </Button>
                                <Button className="px-16" icon={PrinterIcon}>
                                    Print
                                </Button>
                            </div>
                        </div>
                        <p className="pt-2 text-[18px] text-[#848484]">
                            {listingDetail?.data?.Address?.[0]?.route}
                        </p>
                        <div className=" relative pt-8">
                            <div className="grid grid-cols-3 gap-4">
                                {listingDetail?.data?.ListingImage?.[0]?.url && (
                                    <div
                                        onClick={() => setOpenLightBox(true)}
                                        className="col-span-2"
                                    >
                                        <Image
                                            className={
                                                "cursor-pointer object-cover h-[480px] w-full rounded-lg"
                                            }
                                            height={480}
                                            width={400}
                                            src={listingDetail?.data?.ListingImage?.[0].url}
                                            alt="property"
                                            // fill={true}

                                        />
                                    </div>
                                )}
                                <div>
                                    {listingDetail?.data?.ListingImage?.[1]?.url && (
                                        <div onClick={() => setOpenLightBox(true)}>
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
                                        <div onClick={() => setOpenLightBox(true)}>
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
                                    className="absolute bottom-6 right-6 text-white bg-[#97B6FF]  p-3 rounded-lg text-sm border-none inline-flex justify-center max-w-sm text-center"
                                    icon={PhotoIcon}
                                >
                                    View all photos
                                </Button>
                            )}
                        </div>
                        <div className="pt-8">
                            <div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="col-span-2">
                                        <div
                                            className="h-[133px] bg-[#f2f2f2] rounded-lg shadow-md px-16 py-8 flex items-center justify-between">
                                            {stats?.map((el, index) => (
                                                <div key={index}>
                                                    <p className="text-[16px] text-[#616161]">
                                                        {el.title}
                                                    </p>

                                                    <div className="flex items-center pt-4">
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

                                        <div className="pt-16">
                                            <ListingDetailContent
                                                areaAndCapacity={areaAndCapacity}
                                                generalInfo={generalInfo}
                                                construction={construction}
                                                heatingType={listingDetail?.data?.heatingType}
                                                description={listingDetail?.data?.description}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <ListingAgentContactCard
                                            showForm={setShowContactWithAgent}
                                            propertyPrice={listingDetail?.data?.price}
                                        />
                                        {showContactWithAgent && <ListingContactAgentForm/>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {listingDetail?.data?.Address?.[0].latitude && (
                <div className="container">
                    <Divider/>
                    <p className="text-[24px] pb-8">View on map</p>
                    <GoogleMap
                        location={{
                            lat: parseFloat(listingDetail?.data?.Address?.[0]?.latitude),
                            lng: parseFloat(listingDetail?.data?.Address?.[0]?.longitude),
                            address: listingDetail?.data?.Address?.[0]?.locality,
                        }}
                    />
                    <p className="text-[14] pt-8">See more results</p>
                </div>
            )}
            <div className="py-8 mt-16 bg-[#F2F2F2]">
                <div className="container">
                    <p className="font-medium text-[24px]">Similar in this area</p>
                    <div className="flex justify-normal gap-10 py-8 ">
                        {similarAreaInfo.map((item, index) => (
                            <div key={index} className="basis-1/3">
                                <ListingItem
                                    listingItem={item.listingItem}
                                    onSavedIconClick={item.onSavedIconClick}
                                    isLoadingSavedListings={item.isLoadingSavedListings}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className=" container">
                <p className="font-medium text-[24px] pt-14">Price graph</p>
                <Title className="pt-8">
                    Compare this price with other housing in this area
                </Title>
                <LineChart
                    className="mt-6"
                    data={listingDetail?.data?.ListingPrice || []}
                    index="updatedAt"
                    categories={["price"]}
                    colors={["emerald"]}
                />
            </div>
        </div>
    );
};

export default ListingDetail;
