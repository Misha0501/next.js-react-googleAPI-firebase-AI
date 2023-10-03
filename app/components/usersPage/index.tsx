"use client";

import React, { useMemo } from "react";
import ListingContactAgentForm from "../ListingContactAgentForm";
import { Divider } from "@tremor/react";
import GoogleMap from "../GoogleMap";
import { ListingItem } from "../ListingItem";
import Link from "next/link";
import { useUserDetail } from "@/providers/Users";
import { useParams, useRouter } from "next/navigation";
import { CircularProgress } from "@mui/material";
import FloatingContactWidget from "../FloatingContactWidget";
import { EnvelopeIcon, MapIcon, PhoneIcon } from "@heroicons/react/24/outline";

function UserPageMain() {
  const params = useParams();
  const id = Number(params?.id);
  const userDetail = useUserDetail({ id });

  const router = useRouter();

  const company = useMemo(() => {
    if (userDetail?.data?.Company) {
      return userDetail?.data?.Company;
    } else {
      return null;
    }
  }, [userDetail?.data]);

  console.log("company", company, "userDetail", userDetail?.data?.Company);

  let contactNumber =
    company?.phoneNumber ?? userDetail.data?.phoneNumber ?? "";

  const propertyListing = useMemo(() => {
    if (userDetail?.data?.Company) {
      return userDetail?.data?.Company?.Listing;
    } else {
      return userDetail?.data?.Listing;
    }
  }, [userDetail?.data]);

  const handleContactAgentClick = () => {
    // navigate to the contact form
    router.push("#contactAgentForm");
  };

  return (
    <div className="py-8 xl:py-16 m-auto mb-[68px] md:mb-0">
      {userDetail?.isFetching ? (
        <div className="flex items-center justify-center mt-7">
          <CircularProgress />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-10 mt-5 my-10">
            <div className="xl:col-span-2 flex flex-col">
              <h3 className="text-[#222222] text-2xl xl:text-[40px] font-bold">
                {userDetail?.data?.Company
                  ? userDetail?.data?.Company?.name
                  : userDetail?.data?.displayName}
              </h3>
              <div className="flex  my-6">
                {company && (
                  <Link
                    href={"#aboutSection"}
                    className="p-4 bg-none text-[#717D96]  font-bold focus:bg-[#EDF0F7]  focus:text-[#2D3648]  active:bg-[#EDF0F7] active:border-b-2 active:border-[#2D3648]  active:text-[#2D3648] focus:border-b-2 focus:border-[#2D3648]"
                  >
                    About us
                  </Link>
                )}
                <Link
                  href={"#contactSection"}
                  className="p-4 bg-none text-[#717D96]  font-bold focus:bg-[#EDF0F7]   focus:text-[#2D3648]  active:bg-[#EDF0F7] active:border-b-2 active:border-[#2D3648]  active:text-[#2D3648] focus:border-b-2 focus:border-[#2D3648]"
                >
                  Contact
                </Link>
                <Link
                  href={"#propertiesSection"}
                  className="p-4 bg-none text-[#717D96]  font-bold focus:bg-[#EDF0F7]  focus:text-[#2D3648]  active:bg-[#EDF0F7] active:border-b-2 active:border-[#2D3648]  active:text-[#2D3648] focus:border-b-2 focus:border-[#2D3648]"
                >
                  Properties
                </Link>
              </div>
              {company && (
                <>
                  <div id="aboutSection" className="flex flex-col gap-4">
                    <p className="font-bold text-2xl text-[#222222]">
                      About us
                    </p>
                    {userDetail?.data?.Company?.description && (
                      <p className="text-base font-normal text-[#4A5468]">
                        {userDetail?.data?.Company?.description}
                      </p>
                    )}
                  </div>
                  <Divider />
                </>
              )}
              <div id="contactSection">
                <p className="font-bold text-2xl text-[#222222] mb-6">
                  Contact
                </p>
                {(company || userDetail?.data?.phoneNumber) && (
                  <div className="mt-4">
                    <p className="text-md font-semibold mb-2">Phone number</p>
                    <div className="flex items-center">
                      <PhoneIcon width={15} height={15} />
                      <p className="text-md font-normal  text-[#717D96] ml-2">
                        {company?.phoneNumber && (
                          <a
                            href={`tel:${company.phoneNumber}`}
                            className="text-base font-normal text-[#4A5468]"
                          >
                            {company.phoneNumber}
                          </a>
                        )}

                        {!company && (
                          <a
                            href={`tel:${userDetail?.data?.phoneNumber}`}
                            className="text-base font-normal text-[#4A5468]"
                          >
                            {userDetail?.data?.phoneNumber}
                          </a>
                        )}
                      </p>
                    </div>
                  </div>
                )}
                <div className="mt-4">
                  <p className="text-md font-semibold mb-2">Email</p>
                  <div className="flex items-center">
                    <EnvelopeIcon width={15} height={15} />
                    <p className="text-md font-normal  text-[#717D96] ml-2">
                      {company?.email && (
                        <a
                          className="text-base font-normal text-[#4A5468]"
                          href={`mailto:${company.email}`}
                        >
                          {company.email}
                        </a>
                      )}

                      {!company && (
                        <a
                          className="text-base font-normal text-[#4A5468]"
                          href={`mailto:${userDetail?.data?.email}`}
                        >
                          {userDetail?.data?.email}
                        </a>
                      )}
                    </p>
                  </div>
                </div>
                {company && (
                  <>
                    <div className="mt-4 mb-4">
                      <p className="text-md font-semibold mb-2">Address</p>
                      <div className="flex items-center">
                        <MapIcon width={15} height={15} />
                        <p className="text-md font-normal ml-2  text-[#717D96]">
                          {" "}
                          {company?.Address?.[0]?.locality || "-"}
                        </p>
                      </div>
                    </div>
                    {userDetail?.data?.Company?.Address?.[0]?.latitude &&
                      userDetail?.data?.Company?.Address?.[0]?.longitude && (
                        <div
                          id="officeSection"
                          className="flex flex-col gap-4 my-6"
                        >
                          <div className="rounded-lg overflow-hidden">
                            <GoogleMap
                              location={{
                                lat: parseFloat(
                                  userDetail?.data?.Company?.Address?.[0]
                                    ?.latitude,
                                ),
                                lng: parseFloat(
                                  userDetail?.data?.Company?.Address?.[0]
                                    ?.longitude,
                                ),
                                address:
                                  userDetail?.data?.Company?.Address?.[0]
                                    ?.locality,
                              }}
                            />
                          </div>
                        </div>
                      )}
                  </>
                )}
              </div>
              <Divider className={"mb-0"} />
            </div>
            <div id={"contactAgentForm"}>
              <ListingContactAgentForm
                name={userDetail?.data?.displayName ?? ""}
                emailTo={""}
              />
            </div>
          </div>
          <div id="propertiesSection" className="flex flex-col gap-12">
            <p className="font-bold text-2xl text-[#222222]">Properties</p>
            {propertyListing?.length ? (
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-x-6 gap-y-10">
                {propertyListing &&
                  propertyListing.map((item, index) => (
                    <ListingItem
                      listingItemInitial={item}
                      key={index}
                      isLoadingSavedListings={false}
                      isLoading={userDetail?.isFetching}
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
          <FloatingContactWidget
            phoneNumber={contactNumber}
            onContactClick={handleContactAgentClick}
          />
        </>
      )}
    </div>
  );
}

export default UserPageMain;
