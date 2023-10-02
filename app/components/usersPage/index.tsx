"use client";

import React, { useMemo } from "react";
import { GoBackBtn } from "../GoBackBtn";
import Image from "next/image";
import ListingContactAgentForm from "../ListingContactAgentForm";
import { Button, Divider } from "@tremor/react";
import GoogleMap from "../GoogleMap";
import { ListingItem } from "../ListingItem";
import Link from "next/link";
import { useUserDetail } from "@/providers/Users";
import { useParams } from "next/navigation";
import { CircularProgress } from "@mui/material";
import FloatingContactWidget from "../FloatingContactWidget";
import { PhoneIcon, MapIcon } from "@heroicons/react/24/outline";

function UserPageMain() {
  const params = useParams();
  const id = Number(params?.id);
  const userDetail = useUserDetail({ id });

  const propertyListing = useMemo(() => {
    if (userDetail?.data?.Company) {
      return userDetail?.data?.Company?.Listing;
    } else {
      userDetail?.data?.Listing;
    }
  }, [userDetail?.data]);

  function doNothing() {}

  return (
    <div className="py-8 xl:py-16 max-w-sm m-auto md:max-w-md  xl:max-w-7xl mb-[68px] md:mb-0">
      <GoBackBtn label="Back to account" className="text-black" />
      {userDetail?.isFetching ? (
        <div className="flex items-center justify-center mt-7">
          <CircularProgress />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-10 mt-5 xl:mt-10">
            <div className="xl:col-span-2 flex flex-col gap-4">
              {userDetail?.data?.Company?.image && (
                <Image
                  className="rounded-lg"
                  src={userDetail?.data?.Company?.image}
                  width={780}
                  height={480}
                  alt="Image"
                />
              )}
              <h3 className="text-[#222222] text-2xl xl:text-[40px] font-bold">
                {userDetail?.data?.Company
                  ? userDetail?.data?.Company?.name
                  : userDetail?.data?.displayName}
              </h3>
              <div className="flex items-center gap-3">
                <p className="font-bold text-2xl text-[#717D96]">
                  {userDetail?.data?.Company
                    ? userDetail?.data?.Company?.Listing?.length
                    : userDetail?.data?.Listing?.length}
                </p>
                <p className="font-normal text-base text-[#717D96]">for sale</p>
              </div>
              <div className="flex  my-6">
                <Link
                  href={"#descriptionSection"}
                  className="p-4 bg-none text-[#717D96]  font-bold focus:bg-[#EDF0F7]  focus:text-[#2D3648]  active:bg-[#EDF0F7] active:border-b-2 active:border-[#2D3648]  active:text-[#2D3648] focus:border-b-2 focus:border-[#2D3648]"
                >
                  About us
                </Link>
                <Link
                  href={"#propertiesSection"}
                  className="p-4 bg-none text-[#717D96]  font-bold focus:bg-[#EDF0F7]  focus:text-[#2D3648]  active:bg-[#EDF0F7] active:border-b-2 active:border-[#2D3648]  active:text-[#2D3648] focus:border-b-2 focus:border-[#2D3648]"
                >
                  Properties
                </Link>
                {userDetail?.data?.Company && (
                  <Link
                    href={"#officeSection"}
                    className="p-4 bg-none text-[#717D96]  font-bold focus:bg-[#EDF0F7]   focus:text-[#2D3648]  active:bg-[#EDF0F7] active:border-b-2 active:border-[#2D3648]  active:text-[#2D3648] focus:border-b-2 focus:border-[#2D3648]"
                  >
                    Office
                  </Link>
                )}
              </div>
              <Divider />
              <div id="descriptionSection" className="flex flex-col gap-4 my-6">
                <p className="font-bold text-2xl text-[#222222]">Description</p>
                <div className="flex gap-4">
                  {/* <p className="underline decoration-1 font-bold text-sm text-[#222222]">
                Translate
              </p> */}
                </div>
                {userDetail?.data?.Company?.description && (
                  <p className="text-base font-normal text-[#4A5468]">
                    {userDetail?.data?.Company?.description}
                  </p>
                )}
                <p className="underline decoration-1 font-bold text-sm text-[#222222]">
                  Show more &gt;
                </p>
              </div>
              <Divider />
              <div id="contactSection" className="flex flex-col gap-4 my-6">
                <p className="font-bold text-2xl text-[#222222]">Contact</p>
                <div className="mt-4">
                  <p className="text-md font-semibold mb-2">Phone number</p>
                  <div className="flex items-center">
                    <PhoneIcon width={15} height={15} />
                    <p className="text-md font-normal  text-[#717D96] ml-2">
                      +12345676
                    </p>
                  </div>
                </div>
                <div className="mt-4 mb-4">
                  <p className="text-md font-semibold mb-2">Address</p>
                  <div className="flex items-center">
                    <MapIcon width={15} height={15} />

                    <p className="text-md font-normal ml-2  text-[#717D96]">
                      {" "}
                      {userDetail?.data?.Company?.Address?.[0]?.locality || "-"}
                    </p>
                  </div>
                </div>
                <Button className="w-fit" variant="secondary">
                  Show on Maps
                </Button>
              </div>
              <Divider />
              {userDetail?.data?.Company && (
                <>
                  <div id="officeSection" className="flex flex-col gap-4 my-6">
                    <p className="font-bold text-2xl text-[#222222]">
                      Our office
                    </p>
                    <p className="text-lg font-normal text-[#717D96]">
                      {userDetail?.data?.Company?.Address?.[0]?.locality}
                    </p>

                    <div className="rounded-lg overflow-hidden">
                      <GoogleMap
                        location={{
                          lat: parseFloat(
                            userDetail?.data?.Company?.Address?.[0]?.latitude
                          ),
                          lng: parseFloat(
                            userDetail?.data?.Company?.Address?.[0]?.longitude
                          ),
                          address:
                            userDetail?.data?.Company?.Address?.[0]?.locality,
                        }}
                      />
                    </div>

                    <p className=" font-bold text-sm text-[#222222]">
                      See more results in Sofia &gt;
                    </p>
                  </div>
                  <Divider />
                </>
              )}
            </div>
            <div>
              <div className="mb-12">
                <ListingContactAgentForm name={"Company Name"} />
              </div>
              <Divider className=" xl:hidden" />
            </div>
          </div>
          <div id="propertiesSection" className="flex flex-col gap-12 my-6">
            <p className="font-bold text-2xl text-[#222222]">Our properties</p>
            {propertyListing?.length ? (
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-x-6 gap-y-10">
                {propertyListing &&
                  propertyListing.map((item, index) => (
                    <ListingItem
                      // @ts-ignore
                      listingItemInitial={item}
                      key={index}
                      onSavedIconClick={doNothing}
                      isLoadingSavedListings={false}
                      isLoading={userDetail?.isFetching}
                      onEditIconClick={doNothing}
                      onDeleteIconClick={doNothing}
                      ownerView={false}
                    />
                  ))}
              </div>
            ) : (
              <p className="text-center font-semibold text-lg">
                No Data Available
              </p>
            )}
          </div>
          <FloatingContactWidget />
        </>
      )}
    </div>
  );
}

export default UserPageMain;
