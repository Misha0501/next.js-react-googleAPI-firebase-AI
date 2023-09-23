"use client";

import React, {useMemo} from "react";
import {GoBackBtn} from "../GoBackBtn";
import Image from "next/image";
import ListingContactAgentForm from "../ListingContactAgentForm";
import {Divider} from "@tremor/react";
import GoogleMap from "../GoogleMap";
import {ListingItem} from "../ListingItem";
import Link from "next/link";
import {useUserDetail} from "@/providers/Users";
import {useParams} from "next/navigation";
import {CircularProgress} from "@mui/material";

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
    <div className="py-16 px-28">
      <GoBackBtn label="Back to account" className="text-black" />
      {userDetail?.isFetching ? (
        <div className="flex items-center justify-center mt-7">
          <CircularProgress />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-10 mt-10">
            <div className="col-span-2 flex flex-col gap-4">
              {userDetail?.data?.Company?.image && (
                <Image
                  className="rounded-lg"
                  src={userDetail?.data?.Company?.image}
                  width={780}
                  height={480}
                  alt="Image"
                />
              )}
              <h3 className="text-[#222222] text-[40px] font-bold">
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
                  About Company
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
              {userDetail?.data?.Company && (
                <>
                  <div id="officeSection" className="flex flex-col gap-4 my-6">
                    <p className="font-bold text-2xl text-[#222222]">
                      Our office
                    </p>
                    <p className="text-lg font-normal text-[#717D96]">
                      42 Random Street, Sofia 1000, Bulgaria
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
            <div className="">
              <ListingContactAgentForm name={"Company Name"} />
            </div>
          </div>
          <div id="propertiesSection" className="flex flex-col gap-12 my-6">
            <p className="font-bold text-2xl text-[#222222]">Our properties</p>
            {propertyListing?.length ? (
              <div className="grid grid-cols-3 gap-x-6 gap-y-10">
                {propertyListing &&
                  propertyListing.map((item, index) => (
                    <ListingItem
                      //@ts-ignore
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
        </>
      )}
    </div>
  );
}

export default UserPageMain;
