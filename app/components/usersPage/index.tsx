"use client";

import React, { useMemo } from "react";
import { ListingContactAgentForm } from "../ListingContactAgentForm";
import GoogleMap from "../GoogleMap";
import { ListingItem } from "../ListingItem";
import { useUserDetail } from "@/providers/Users";
import { useParams, useRouter } from "next/navigation";
import { CircularProgress } from "@mui/material";
import FloatingContactBar from "../listingDetailPage/FloatingContactBar";
import {
  EnvelopeIcon,
  MapPinIcon,
  PhoneIcon,
  BuildingOffice2Icon,
  UserIcon,
  HomeModernIcon,
} from "@heroicons/react/24/outline";
import { getPopulatedListingsSaved } from "@/app/lib/listing/getPopulatedListingsSaved";
import { useAuthContext } from "@/app/context/AuthContext";
import { useSavedListings } from "@/providers/SavedListings";
import { Listing } from "@/types";

function UserPageMain() {
  const { authToken } = useAuthContext();
  const params = useParams();
  const id = Number(params?.id);
  const userDetail = useUserDetail({ id });

  const router = useRouter();
  const usersSavedListings = useSavedListings({ authToken });

  const company = useMemo(
    () => userDetail?.data?.Company ?? null,
    [userDetail?.data],
  );

  const contactNumber =
    company?.phoneNumber ?? userDetail.data?.phoneNumber ?? "";
  const displayName = company?.name ?? userDetail?.data?.displayName ?? "";
  const isCompany = !!company;
  const email = company?.email ?? userDetail?.data?.email ?? "";
  const address = company?.Address?.[0];
  const hasMap = !!address?.latitude && !!address?.longitude;

  const propertyListing = useMemo(
    () =>
      isCompany
        ? userDetail?.data?.Company?.Listing
        : userDetail?.data?.Listing,
    [userDetail?.data, isCompany],
  );

  const populatedListings = useMemo(
    () =>
      getPopulatedListingsSaved(
        (propertyListing as Listing[] | undefined) ?? [],
        usersSavedListings?.data?.results ?? [],
      ),
    [propertyListing, usersSavedListings?.data?.results],
  );

  const initials = displayName
    .split(" ")
    .slice(0, 2)
    .map((w: string) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div className="pb-32">
      {userDetail?.isFetching ? (
        <div className="flex items-center justify-center mt-20">
          <CircularProgress />
        </div>
      ) : (
        <>
          {/* ── Hero ─────────────────────────────────────────────────── */}
          <div className="bg-gradient-to-br from-[#1a2332] to-[#2D3648] -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 pt-12 pb-20">
            <div className="max-w-screen-xl mx-auto flex flex-col sm:flex-row items-start sm:items-end gap-6">
              <div className="flex-shrink-0 h-20 w-20 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center">
                <span className="text-2xl font-bold text-white tracking-wide">
                  {initials || (isCompany ? "CO" : "U")}
                </span>
              </div>
              <div className="flex flex-col gap-2 pb-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full bg-white/10 text-white/70 border border-white/15">
                    {isCompany ? (
                      <>
                        <BuildingOffice2Icon className="h-3.5 w-3.5" />
                        Real estate agent
                      </>
                    ) : (
                      <>
                        <UserIcon className="h-3.5 w-3.5" />
                        Private owner
                      </>
                    )}
                  </span>
                  {populatedListings.length > 0 && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full bg-white/10 text-white/70 border border-white/15">
                      <HomeModernIcon className="h-3.5 w-3.5" />
                      {populatedListings.length}{" "}
                      {populatedListings.length === 1 ? "listing" : "listings"}
                    </span>
                  )}
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
                  {displayName}
                </h1>
              </div>
            </div>
          </div>

          <div className="max-w-screen-xl mx-auto">
            {/* ── Contact actions ───────────────────────────────────── */}
            <div className="-mt-6 mb-8 rounded-3xl border border-slate-200 bg-white p-2 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
              <div className="flex flex-col gap-3 rounded-[1.35rem] bg-[#F8FAFC] p-3 sm:flex-row sm:flex-wrap sm:items-center">
                {contactNumber && (
                  <a
                    href={`tel:${contactNumber}`}
                    className="group inline-flex min-h-[58px] flex-1 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 transition hover:border-[#CFE0FF] hover:bg-[#EAF2FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F5FD6]/25"
                  >
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#EAF2FF] text-[#1F5FD6]">
                      <PhoneIcon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="mb-0.5 text-[10px] font-black uppercase leading-none tracking-[0.18em] text-[#717D96]">
                        Call
                      </p>
                      <p className="text-sm font-black text-[#2D3648] transition-colors group-hover:text-[#1F5FD6]">
                        {contactNumber}
                      </p>
                    </div>
                  </a>
                )}
                {email && (
                  <a
                    href="#contactAgentForm"
                    className="group inline-flex min-h-[58px] flex-1 items-center gap-3 rounded-2xl bg-[#1F5FD6] px-4 py-3 text-white shadow-[0_16px_30px_rgba(31,95,214,0.22)] transition hover:bg-[#184FB5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F5FD6]/25 focus-visible:ring-offset-2"
                  >
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-white/15 text-white">
                      <EnvelopeIcon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="mb-0.5 text-[10px] font-black uppercase leading-none tracking-[0.18em] text-white/70">
                        Message
                      </p>
                      <p className="text-sm font-black text-white">
                        Send enquiry
                      </p>
                    </div>
                  </a>
                )}
                {address && (
                  <div className="inline-flex min-h-[58px] flex-1 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#FFF7ED] text-[#C2410C]">
                      <MapPinIcon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="mb-0.5 text-[10px] font-black uppercase leading-none tracking-[0.18em] text-[#717D96]">
                        Address
                      </p>
                      <p className="text-sm font-black text-[#2D3648]">
                        {[address.route, address.locality]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ── About ────────────────────────────────────────────────── */}
            {isCompany && company?.description && (
              <div className="bg-white border border-gray-100 rounded-2xl shadow-sm px-6 py-6 mb-8">
                <h2 className="text-sm font-semibold uppercase tracking-widest text-[#717D96] mb-3">
                  About
                </h2>
                <p className="text-[#4A5468] leading-relaxed text-base">
                  {company.description}
                </p>
              </div>
            )}

            {/* ── Map ──────────────────────────────────────────────────── */}
            {hasMap && (
              <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden mb-8">
                <div className="px-6 pt-5 pb-3">
                  <h2 className="text-sm font-semibold uppercase tracking-widest text-[#717D96]">
                    Office location
                  </h2>
                </div>
                <GoogleMap
                  location={{
                    lat: parseFloat(address!.latitude),
                    lng: parseFloat(address!.longitude),
                    address: address!.locality,
                  }}
                />
              </div>
            )}

            {/* ── Properties ───────────────────────────────────────────── */}
            <div className="mb-14">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[#2D3648]">
                  {isCompany ? "Company listings" : "Listings"}
                </h2>
                {populatedListings.length > 0 && (
                  <span className="text-sm text-[#717D96]">
                    {populatedListings.length}{" "}
                    {populatedListings.length === 1 ? "property" : "properties"}
                  </span>
                )}
              </div>
              {populatedListings.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-8">
                  {populatedListings.map((item, index) => (
                    <ListingItem
                      listingItemInitial={item}
                      key={index}
                      isLoading={userDetail?.isFetching}
                      ownerView={false}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-2xl border border-gray-100">
                  <HomeModernIcon className="h-10 w-10 text-gray-300 mb-3" />
                  <p className="text-[#717D96] font-medium">No listings yet</p>
                </div>
              )}
            </div>

            {/* ── Contact form ─────────────────────────────────────────── */}
            <div id="contactAgentForm" className="max-w-2xl mx-auto">
              <ListingContactAgentForm
                name={displayName}
                emailTo={email}
                subject="Someone is interested in your company!"
              />
            </div>
          </div>
        </>
      )}

      <FloatingContactBar
        initialPhoneNumber={contactNumber}
        contactLabel={isCompany ? "Contact agent" : "Contact owner"}
      />
    </div>
  );
}

export default UserPageMain;
