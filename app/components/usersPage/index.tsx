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

export type UserProfileMode = "personal" | "company";

type UserPageMainProps = {
  profileMode?: UserProfileMode;
};

const UserPageMain = ({ profileMode }: UserPageMainProps) => {
  const { isAuthenticated } = useAuthContext();
  const params = useParams();
  const id = Number(params?.id);
  const userDetail = useUserDetail({ id });

  const router = useRouter();
  const usersSavedListings = useSavedListingIds({ enabled: isAuthenticated });

  const company = useMemo(
    () => userDetail?.data?.Company ?? null,
    [userDetail?.data],
  );
  const isCompany = !!company && profileMode !== "personal";
  const activeCompany = isCompany ? company : null;

  const contactNumber =
    activeCompany?.phoneNumber ?? userDetail.data?.phoneNumber ?? "";
  const displayName =
    activeCompany?.name ?? userDetail?.data?.displayName ?? "";
  const email = activeCompany?.email ?? userDetail?.data?.email ?? "";
  const contactTargetType = isCompany ? "COMPANY" : "USER";
  const contactTargetId = isCompany ? activeCompany?.id : id;
  const address = activeCompany?.Address?.[0];
  const hasMap = !!address?.latitude && !!address?.longitude;

  const personalListings = useMemo(() => {
    const userListings =
      (userDetail?.data?.Listing as Listing[] | undefined) ?? [];

    return getPopulatedListingsSaved(
      // `applicationUser.Listing` includes every listing this user created,
      // even ones already attributed to their company - exclude those here
      // so a listing posted as the company doesn't also show as personal.
      company ? userListings.filter((item) => !item.companyId) : userListings,
      usersSavedListings?.data ?? [],
    );
  }, [company, userDetail?.data?.Listing, usersSavedListings?.data]);

  const companyListings = useMemo(
    () =>
      getPopulatedListingsSaved(
        (userDetail?.data?.Company?.Listing as Listing[] | undefined) ?? [],
        usersSavedListings?.data ?? [],
      ),
    [userDetail?.data?.Company?.Listing, usersSavedListings?.data],
  );

  const totalListingsCount = isCompany
    ? companyListings.length
    : personalListings.length;

  const initials = displayName
    .split(" ")
    .slice(0, 2)
    .map((w: string) => w[0])
    .join("")
    .toUpperCase();

  const renderListingGroup = (title: string, listings: Listing[]) => (
    <div className="mb-14">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#2D3648]">{title}</h2>
        {listings.length > 0 && (
          <span className="text-sm text-[#717D96]">
            {listings.length}{" "}
            {listings.length === 1 ? "property" : "properties"}
          </span>
        )}
      </div>
      {listings.length > 0 ? (
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 xl:grid-cols-3">
          {listings.map((item, index) => (
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
          <p className="font-medium text-[#717D96]">No properties yet</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="pb-32">
      {userDetail?.isFetching ? (
        <div className="mt-20 flex items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-200 border-t-[#1F5FD6]" />
        </div>
      ) : (
        <>
          {/* ── Hero ─────────────────────────────────────────────────── */}
          <div className="-mx-4 bg-gradient-to-br from-[#1a2332] to-[#2D3648] px-4 pt-12 pb-20 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
            <div className="mx-auto flex max-w-screen-xl flex-col items-start gap-6 sm:flex-row sm:items-end">
              <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/10">
                <span className="text-2xl font-bold tracking-wide text-white">
                  {initials || (isCompany ? "CO" : "U")}
                </span>
              </div>
              <div className="flex flex-col gap-2 pb-1">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-xs font-semibold tracking-widest text-white/70 uppercase">
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
                  {totalListingsCount > 0 && (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-xs font-semibold tracking-widest text-white/70 uppercase">
                      <HomeModernIcon className="h-3.5 w-3.5" />
                      {totalListingsCount}{" "}
                      {totalListingsCount === 1 ? "property" : "properties"}
                    </span>
                  )}
                </div>
                <h1 className="text-3xl leading-tight font-bold text-white sm:text-4xl">
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
                    className="group inline-flex min-h-[58px] flex-1 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 transition hover:border-[#CFE0FF] hover:bg-[#EAF2FF] focus-visible:ring-2 focus-visible:ring-[#1F5FD6]/25 focus-visible:outline-none"
                  >
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#EAF2FF] text-[#1F5FD6]">
                      <PhoneIcon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="mb-0.5 text-[10px] leading-none font-black tracking-[0.18em] text-[#717D96] uppercase">
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
                    className="group inline-flex min-h-[58px] flex-1 items-center gap-3 rounded-2xl bg-[#1F5FD6] px-4 py-3 text-white shadow-[0_16px_30px_rgba(31,95,214,0.22)] transition hover:bg-[#184FB5] focus-visible:ring-2 focus-visible:ring-[#1F5FD6]/25 focus-visible:ring-offset-2 focus-visible:outline-none"
                  >
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-white/15 text-white">
                      <EnvelopeIcon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="mb-0.5 text-[10px] leading-none font-black tracking-[0.18em] text-white/70 uppercase">
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
                      <p className="mb-0.5 text-[10px] leading-none font-black tracking-[0.18em] text-[#717D96] uppercase">
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
            {isCompany && activeCompany?.description && (
              <div className="mb-8 rounded-2xl border border-gray-100 bg-white px-6 py-6 shadow-sm">
                <h2 className="mb-3 text-sm font-semibold tracking-widest text-[#717D96] uppercase">
                  About
                </h2>
                <p className="text-base leading-relaxed text-[#4A5468]">
                  {activeCompany.description}
                </p>
              </div>
            )}

            {/* ── Map ──────────────────────────────────────────────────── */}
            {hasMap && (
              <div className="mb-8 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                <div className="px-6 pt-5 pb-3">
                  <h2 className="text-sm font-semibold tracking-widest text-[#717D96] uppercase">
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
            {isCompany
              ? renderListingGroup("Company properties", companyListings)
              : renderListingGroup("Properties", personalListings)}

            {/* ── Contact form ─────────────────────────────────────────── */}
            {contactTargetId && (
              <div id="contactAgentForm" className="mx-auto max-w-2xl">
                <ListingContactAgentForm
                  name={displayName}
                  targetType={contactTargetType}
                  targetId={contactTargetId}
                  subject={
                    isCompany
                      ? "Someone is interested in your company!"
                      : "Someone is interested in your property!"
                  }
                />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default UserPageMain;
