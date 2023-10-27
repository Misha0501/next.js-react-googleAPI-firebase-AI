"use client";

import React, { useState } from "react";
import { Listing } from "@/types";
import { getCurrencySign } from "@/app/lib/getCurrencySign";
import Link from "next/link";
import { Button } from "@tremor/react";
import { ListingContactAgentForm } from "@/app/components/ListingContactAgentForm";
import { useRouter } from "next/navigation";
import { useListigDetailContext } from "@/app/context/ListingDetailContext";

type Props = {
  listing: Listing | undefined;
};

export const ListingAgentContactCard = ({ listing }: Props) => {
  let [agentContactState, setAgentContactState] = useState("Show Phone Number");
  const router = useRouter();
  const {contactSellerFormVisible, setContactSellerFormVisible} = useListigDetailContext();

  let contactNumber =
    listing?.company?.phoneNumber ??
    listing?.applicationUser?.phoneNumber ??
    "";
  const showContact = () => {
    setAgentContactState(
      agentContactState !== contactNumber ? contactNumber : "Show Phone Number",
    );
  };

  const handleContactAgentClick = () => {
    setContactSellerFormVisible(true);
    // navigate to the contact form
    router.push("#contactAgentForm");
  };

  return (
    <>
      <div className=" mb-8 w-full bg-[#F2F2F2] rounded-lg shadow-md px-8 py-9">
        <div className="mb-8">
          <p className="mb-1 font-light text-gray-500 dark:text-gray-400">
            Asking Price{" "}
          </p>
          <div className="flex items-baseline mb-8 text-gray-900 dark:text-white">
            <span className="text-2xl font-semibold" data-testid={'priceCurrencySignDesktop'}>
              {getCurrencySign(listing?.currency)}
            </span>
            <span className="text-3xl font-semibold tracking-tight" data-testid={'priceDesktop'}>
              {new Intl.NumberFormat().format(listing?.price)}
            </span>
          </div>
          {contactNumber && (
            <>
              {agentContactState !== contactNumber && (
                <Button
                  onClick={showContact}
                  className="w-full"
                  variant={"secondary"}
                  data-testid={'contactPhoneNumberButton'}
                >
                  {agentContactState}
                </Button>
              )}
              {agentContactState === contactNumber && (
                <a href={`tel:${contactNumber}`}>
                  <Button className="w-full" variant={"secondary"}
                          data-testid={'contactPhoneNumberButton'}
                  >
                    {agentContactState}
                  </Button>
                </a>
              )}
            </>
          )}
        </div>
        <div>
          <p className="mb-6 font-light text-gray-500 dark:text-gray-400" data-testid={"listedBy"}>
            Listed by{" "}
            {listing?.company?.name ? " real estate agent" : " private owner"}
          </p>
          <div className="flex items-center space-x-4 mb-8">
            <div className="flex-1 min-w-0">
              <Link href={`/users/${listing?.applicationUser?.id}`} data-testid={"userName"}>
                <p className="font-bold text-gray-900 truncate dark:text-white">
                  {listing?.applicationUser?.displayName}
                </p>
                {listing?.company?.name && (
                  <p className="text-md text-gray-500 truncate dark:text-gray-400">
                    {listing?.company?.name}
                  </p>
                )}
              </Link>
            </div>
          </div>
          <Button
            onClick={handleContactAgentClick}
            variant={"primary"}
            className={"w-full"}
            data-testid={'contactSellerButton'}
          >
            Contact seller
          </Button>
        </div>
      </div>
      {contactSellerFormVisible && (
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
    </>
  );
};
