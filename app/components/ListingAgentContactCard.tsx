"use client";

import React, { useState } from "react";
import { Listing } from "@/types";
import Link from "next/link";
import { Button } from "@tremor/react";
import { ListingContactAgentForm } from "@/app/components/ListingContactAgentForm";
import { useRouter } from "next/navigation";
import { useListigDetailContext } from "@/app/context/ListingDetailContext";
import { formatEuroPrice } from "@/app/lib/formatPrice";
import { ArrowTopRightOnSquareIcon, PhoneIcon, EnvelopeIcon } from "@heroicons/react/24/outline";

type Props = {
  listing: Listing | undefined;
};

export const ListingAgentContactCard = ({ listing }: Props) => {
  let [agentContactState, setAgentContactState] = useState("Show Phone Number");
  const router = useRouter();
  const { contactSellerFormVisible, setContactSellerFormVisible } = useListigDetailContext();

  let contactNumber =
    listing?.company?.phoneNumber ?? listing?.applicationUser?.phoneNumber ?? "";

  const showContact = () => {
    setAgentContactState(
      agentContactState !== contactNumber ? contactNumber : "Show Phone Number",
    );
  };

  const handleContactAgentClick = () => {
    setContactSellerFormVisible(true);
    router.push("#contactAgentForm");
  };

  return (
    <>
      <div className="mb-8 w-full bg-white border border-gray-200 rounded-xl shadow-sm px-8 py-8">
        {/* Price */}
        <div className="mb-6 pb-6 border-b border-gray-100">
          <p className="text-xs uppercase tracking-widest text-[#717D96] mb-1">
            Asking Price
          </p>
          <span className="text-3xl font-semibold text-[#2D3648]" data-testid="priceDesktop">
            {formatEuroPrice(listing?.price)}
          </span>
        </div>

        {/* Agent info */}
        <div className="mb-6">
          <p className="text-xs uppercase tracking-widest text-[#717D96] mb-3">
            Listed by{" "}
            {listing?.company?.name ? "real estate agent" : "private owner"}
          </p>
          <Link
            href={`/users/${listing?.applicationUser?.id}`}
            data-testid="userName"
            className="group flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 hover:border-gray-300 hover:bg-gray-100 transition-colors"
          >
            <div>
              <p className="font-semibold text-[#2D3648] group-hover:text-blue-600 transition-colors">
                {listing?.applicationUser?.displayName}
              </p>
              {listing?.company?.name && (
                <p className="text-sm text-[#717D96] mt-0.5">
                  {listing.company.name}
                </p>
              )}
            </div>
            <ArrowTopRightOnSquareIcon className="h-4 w-4 text-[#717D96] group-hover:text-blue-600 shrink-0 ml-2 transition-colors" />
          </Link>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          {contactNumber && (
            agentContactState !== contactNumber ? (
              <Button
                onClick={showContact}
                className="w-full"
                variant="secondary"
                data-testid="contactPhoneNumberButton"
                icon={PhoneIcon}
              >
                Show Phone Number
              </Button>
            ) : (
              <a href={`tel:${contactNumber}`} className="w-full">
                <Button className="w-full" variant="secondary" data-testid="contactPhoneNumberButton" icon={PhoneIcon}>
                  {agentContactState}
                </Button>
              </a>
            )
          )}
          <Button
            onClick={handleContactAgentClick}
            variant="primary"
            className="w-full"
            data-testid="contactSellerButton"
            icon={EnvelopeIcon}
          >
            Contact seller
          </Button>
        </div>
      </div>

      {contactSellerFormVisible && (
        <div id="contactAgentForm" data-testid="contactAgentForm">
          <ListingContactAgentForm
            name={listing?.company?.name || listing?.applicationUser?.displayName || ""}
            emailTo={listing?.company?.email || listing?.applicationUser?.email || ""}
          />
        </div>
      )}
    </>
  );
};
