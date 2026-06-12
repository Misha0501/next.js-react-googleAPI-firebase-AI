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

  const company = useMemo(() => userDetail?.data?.Company ?? null, [userDetail?.data]);

  const contactNumber = company?.phoneNumber ?? userDetail.data?.phoneNumber ?? "";
  const displayName = company?.name ?? userDetail?.data?.displayName ?? "";
  const isCompany = !!company;
  const email = company?.email ?? userDetail?.data?.email ?? "";
  const address = company?.Address?.[0];
  const hasMap = !!address?.latitude && !!address?.longitude;

  const propertyListing = useMemo(
    () => (isCompany ? userDetail?.data?.Company?.Listing : userDetail?.data?.Listing),
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
                      <><BuildingOffice2Icon className="h-3.5 w-3.5" />Real estate agent</>
                    ) : (
                      <><UserIcon className="h-3.5 w-3.5" />Private owner</>
                    )}
                  </span>
                  {populatedListings.length > 0 && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full bg-white/10 text-white/70 border border-white/15">
                      <HomeModernIcon className="h-3.5 w-3.5" />
                      {populatedListings.length} {populatedListings.length === 1 ? "listing" : "listings"}
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
            {/* ── Contact chips ─────────────────────────────────────── */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm px-6 py-4 -mt-6 mb-8 flex flex-wrap items-center gap-3">
              {contactNumber && (
                <a
                  href={`tel:${contactNumber}`}
                  className="group inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 hover:border-blue-200 hover:bg-blue-50 transition-colors"
                >
                  <div className="h-7 w-7 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <PhoneIcon className="h-3.5 w-3.5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-[#717D96] leading-none mb-0.5">Phone</p>
                    <p className="text-sm font-semibold text-[#2D3648] group-hover:text-blue-600 transition-colors">
                      {contactNumber}
                    </p>
                  </div>
                </a>
              )}
              {email && (
                <a
                  href={`mailto:${email}`}
                  className="group inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 hover:border-emerald-200 hover:bg-emerald-50 transition-colors"
                >
                  <div className="h-7 w-7 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <EnvelopeIcon className="h-3.5 w-3.5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-[#717D96] leading-none mb-0.5">Email</p>
                    <p className="text-sm font-semibold text-[#2D3648] group-hover:text-emerald-600 transition-colors break-all">
                      {email}
                    </p>
                  </div>
                </a>
              )}
              {address && (
                <div className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200">
                  <div className="h-7 w-7 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <MapPinIcon className="h-3.5 w-3.5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-[#717D96] leading-none mb-0.5">Address</p>
                    <p className="text-sm font-semibold text-[#2D3648]">
                      {[address.route, address.locality].filter(Boolean).join(", ")}
                    </p>
                  </div>
                </div>
              )}
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
                    {populatedListings.length} {populatedListings.length === 1 ? "property" : "properties"}
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

      <FloatingContactBar initialPhoneNumber={contactNumber} />
    </div>
  );
}

export default UserPageMain;
