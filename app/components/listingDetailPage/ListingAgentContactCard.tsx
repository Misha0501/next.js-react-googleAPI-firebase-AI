"use client";

import React, { useState } from "react";
import { Listing } from "@/types";
import Link from "next/link";
import { ListingContactAgentForm } from "@/app/components/listingDetailPage/ListingContactAgentForm";
import { useRouter } from "next/navigation";
import { useListigDetailContext } from "@/app/context/ListingDetailContext";
import { formatEuroPrice } from "@/app/lib/formatPrice";
import {
  ArrowTopRightOnSquareIcon,
  PhoneIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";

type Props = {
  listing: Listing | undefined;
};

export const ListingAgentContactCard = ({ listing }: Props) => {
  let [agentContactState, setAgentContactState] = useState("Show Phone Number");
  const router = useRouter();
  const { contactSellerFormVisible, setContactSellerFormVisible } =
    useListigDetailContext();

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
    router.push("#contactAgentForm");
  };

  const phoneHref = contactNumber.replace(/\s+/g, "");

  return (
    <>
      <div className="w-full rounded-3xl border border-slate-200 bg-white p-2 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
        <div className="rounded-[1.35rem] bg-[#F8FAFC] px-5 py-5">
          <p className="mb-1 text-xs font-black uppercase tracking-[0.18em] text-[#717D96]">
            Asking price
          </p>
          <span className="sr-only" data-testid="priceCurrencySignDesktop">
            €
          </span>
          <span
            className="text-3xl font-black tracking-tight text-[#2D3648]"
            data-testid="priceDesktop"
          >
            {formatEuroPrice(listing?.price)}
          </span>
        </div>

        <div className="px-4 py-5">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-[#717D96]">
            Listed by{" "}
            {listing?.company?.name ? "real estate agent" : "private owner"}
          </p>
          <Link
            href={`/users/${listing?.applicationUser?.id}`}
            data-testid="userName"
            className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 transition-colors hover:border-[#CFE0FF] hover:bg-[#EAF2FF]"
          >
            <div>
              <p className="font-black text-[#2D3648] transition-colors group-hover:text-[#1F5FD6]">
                {listing?.applicationUser?.displayName}
              </p>
              {listing?.company?.name && (
                <p className="mt-0.5 text-sm text-[#717D96]">
                  {listing.company.name}
                </p>
              )}
            </div>
            <ArrowTopRightOnSquareIcon className="ml-2 h-4 w-4 shrink-0 text-[#717D96] transition-colors group-hover:text-[#1F5FD6]" />
          </Link>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 px-4 pb-5">
          {contactNumber &&
            (agentContactState !== contactNumber ? (
              <button
                type="button"
                onClick={showContact}
                className="inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-[#334155] transition hover:border-[#CFE0FF] hover:bg-[#EAF2FF] hover:text-[#1F5FD6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F5FD6]/25"
                data-testid="contactPhoneNumberButton"
              >
                <PhoneIcon className="h-5 w-5" aria-hidden="true" />
                Show Phone Number
              </button>
            ) : (
              <a href={`tel:${phoneHref}`} className="w-full">
                <span
                  className="inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl border border-[#CFE0FF] bg-[#EAF2FF] px-4 py-3 text-sm font-black text-[#1F5FD6] transition hover:bg-[#DDEAFF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F5FD6]/25"
                  data-testid="contactPhoneNumberButton"
                >
                  <PhoneIcon className="h-5 w-5" aria-hidden="true" />
                  {agentContactState}
                </span>
              </a>
            ))}
          <button
            type="button"
            onClick={handleContactAgentClick}
            className="inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-[#1F5FD6] px-4 py-3 text-sm font-black text-white shadow-[0_16px_30px_rgba(31,95,214,0.24)] transition hover:bg-[#184FB5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F5FD6]/25 focus-visible:ring-offset-2"
            data-testid="contactSellerButton"
          >
            <EnvelopeIcon className="h-5 w-5" aria-hidden="true" />
            Contact seller
          </button>
        </div>
      </div>

      {contactSellerFormVisible && (
        <div id="contactAgentForm" data-testid="contactAgentForm">
          <ListingContactAgentForm
            name={
              listing?.company?.name ||
              listing?.applicationUser?.displayName ||
              ""
            }
            emailTo={
              listing?.company?.email || listing?.applicationUser?.email || ""
            }
          />
        </div>
      )}
    </>
  );
};
