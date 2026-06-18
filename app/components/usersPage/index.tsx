"use client";

import React, { useMemo } from "react";
import { ListingContactAgentForm } from "@/app/components/listingDetailPage/ListingContactAgentForm";
import GoogleMap from "@/app/components/shared/GoogleMap";
import { ListingItem } from "@/app/components/ListingItem";
import { useUserDetail } from "@/providers/Users";
import { useParams, useRouter } from "next/navigation";
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
import { useSavedListingIds } from "@/providers/SavedListings";
import { Listing } from "@/types";

const UserPageMain = () => {
  const { authToken } = useAuthContext();
  const params = useParams();
  const id = Number(params?.id);
  const userDetail = useUserDetail({ id });

  const router = useRouter();
  const usersSavedListings = useSavedListingIds({ authToken });

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
        usersSavedListings?.data ?? [],
      ),
    [propertyListing, usersSavedListings?.data],
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
        <div className="mt-20 flex items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-200 border-t-[#1F5FD6]" />
        </div>
      ) : (
        <>
          {/* ── Hero ─────────────────────────────────────────────────── */}
          <div className="-mx-4 bg-gradient-to-br from-[#1a2332] to-[#2D3648] px-4 pb-20 pt-12 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
            <div className="mx-auto flex max-w-screen-xl flex-col items-start gap-6 sm:flex-row sm:items-end">
              <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/10">
                <span className="text-2xl font-bold tracking-wide text-white">
                  {initials || (isCompany ? "CO" : "U")}
                </span>
              </div>
              <div className="flex flex-col gap-2 pb-1">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="border-white/15 inline-flex items-center gap-1.5 rounded-full border bg-white/10 px-2.5 py-1 text-xs font-semibold uppercase tracking-widest text-white/70">
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
                    <span className="border-white/15 inline-flex items-center gap-1.5 rounded-full border bg-white/10 px-2.5 py-1 text-xs font-semibold uppercase tracking-widest text-white/70">
                      <HomeModernIcon className="h-3.5 w-3.5" />
                      {populatedListings.length}{" "}
                      {populatedListings.length === 1
                        ? "property"
                        : "properties"}
                    </span>
                  )}
                </div>
                <h1 className="text-3xl font-bold leading-tight text-white sm:text-4xl">
                  {displayName}
                </h1>
              </div>
            </div>
          </div>

          <div className="mx-auto max-w-screen-xl">
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
                    <div className="bg-white/15 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-white">
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
              <div className="mb-8 rounded-2xl border border-gray-100 bg-white px-6 py-6 shadow-sm">
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#717D96]">
                  About
                </h2>
                <p className="text-base leading-relaxed text-[#4A5468]">
                  {company.description}
                </p>
              </div>
            )}

            {/* ── Map ──────────────────────────────────────────────────── */}
            {hasMap && (
              <div className="mb-8 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                <div className="px-6 pb-3 pt-5">
                  <h2 className="text-sm font-semibold uppercase tracking-widest text-[#717D96]">
                    Office location
                  </h2>
                </div>
                <GoogleMap
                  location={{
                    lat: parseFloat(address!.latitude),
                    lng: parseFloat(address!.longitude),
                    address: address!.locality ?? "",
                  }}
                />
              </div>
            )}

            {/* ── Properties ───────────────────────────────────────────── */}
            <div className="mb-14">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-[#2D3648]">
                  {isCompany ? "Company properties" : "Properties"}
                </h2>
                {populatedListings.length > 0 && (
                  <span className="text-sm text-[#717D96]">
                    {populatedListings.length}{" "}
                    {populatedListings.length === 1 ? "property" : "properties"}
                  </span>
                )}
              </div>
              {populatedListings.length > 0 ? (
                <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 xl:grid-cols-3">
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
                <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-100 bg-gray-50 py-16">
                  <HomeModernIcon className="mb-3 h-10 w-10 text-gray-300" />
                  <p className="font-medium text-[#717D96]">
                    No properties yet
                  </p>
                </div>
              )}
            </div>

            {/* ── Contact form ─────────────────────────────────────────── */}
            <div id="contactAgentForm" className="mx-auto max-w-2xl">
              <ListingContactAgentForm
                name={displayName}
                emailTo={email}
                subject="Someone is interested in your company!"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserPageMain;
