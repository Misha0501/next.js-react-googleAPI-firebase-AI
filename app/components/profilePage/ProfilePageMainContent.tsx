"use client";

import { signOut } from "firebase/auth";
import { firebaseClientAuth } from "@/app/lib/firebase/configClient";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SavedItemsPageTabs } from "@/app/components/profilePage/SavedItemsPageTabs";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useAuthContext } from "@/app/context/AuthContext";
import { RecentlyViewedListings } from "@/app/components/profilePage/RecentlyViewedListings";
import { CompanyTab } from "@/app/components/profilePage/CompanyTab";
import { InvitesTab } from "@/app/components/profilePage/InvitesTab";
import { PersonalDetailsTab } from "@/app/components/profilePage/PersonalDetailsTab";
import { PropertiesTab } from "@/app/components/profilePage/PropertiesTab";
import { ProfilePageOwnListings } from "@/app/components/profilePage/ProfilePageOwnListings";
import { useUserOwnData } from "@/providers/Users";
import { Listing } from "@/types";
import {
  ArrowRightOnRectangleIcon,
  BriefcaseIcon,
  BuildingOffice2Icon,
  ClockIcon,
  EnvelopeIcon,
  HeartIcon,
  HomeModernIcon,
  ShieldCheckIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

type Props = {
  tab: string;
  view?: string;
};

type ProfileTab = {
  id: string;
  href: string;
  label: string;
  title: string;
  description: string;
  icon: ReactNode;
};

const PROFILE_TABS: ProfileTab[] = [
  {
    id: "myProperties",
    href: "/profile/myProperties",
    label: "Properties",
    title: "My properties",
    description: "Manage your published properties and company portfolio.",
    icon: <HomeModernIcon className="h-5 w-5" />,
  },
  {
    id: "saved",
    href: "/profile/saved",
    label: "Saved",
    title: "Saved items",
    description: "Review saved properties and searches you want to revisit.",
    icon: <HeartIcon className="h-5 w-5" />,
  },
  {
    id: "myAccount",
    href: "/profile/myAccount",
    label: "Personal details",
    title: "Personal details",
    description: "Keep your contact details and password up to date.",
    icon: <UserCircleIcon className="h-5 w-5" />,
  },
  {
    id: "company",
    href: "/profile/company",
    label: "Company",
    title: "Company profile",
    description: "Create or update your agency profile and office address.",
    icon: <BuildingOffice2Icon className="h-5 w-5" />,
  },
  {
    id: "invites",
    href: "/profile/invites",
    label: "Invites",
    title: "Company invites",
    description: "Send, accept, decline, and review company invitations.",
    icon: <EnvelopeIcon className="h-5 w-5" />,
  },
  {
    id: "recentlyViewed",
    href: "/profile/recentlyViewed",
    label: "Recently viewed",
    title: "Recently viewed",
    description: "Return to properties you opened recently.",
    icon: <ClockIcon className="h-5 w-5" />,
  },
];

const PROFILE_TAB_BY_ID = PROFILE_TABS.reduce<Record<string, ProfileTab>>(
  (acc, item) => {
    acc[item.id] = item;
    return acc;
  },
  {},
);

const getInitials = (value?: string | null) => {
  if (!value) return "HF";

  return value
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
};

export const ProfilePageMainContent = ({ tab, view }: Props) => {
  const router = useRouter();
  const { authToken } = useAuthContext();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const activeTab = PROFILE_TAB_BY_ID[tab] ?? PROFILE_TAB_BY_ID.myProperties;

  const {
    data: applicationUser,
    isLoading,
    error,
  } = useUserOwnData({ authToken });

  const company = useMemo(() => {
    if (applicationUser?.Membership && applicationUser?.Membership.length) {
      return applicationUser?.Membership[0].company;
    }
    return null;
  }, [applicationUser]);

  const showSkeleton = !authToken || isLoading;
  const ownListings = (applicationUser?.Listing as Listing[] | undefined) || [];
  const companyListings = (company?.Listing as Listing[] | undefined) || [];
  const displayName = applicationUser?.displayName || "Your account";
  const email = applicationUser?.email || "";

  useEffect(() => {
    if (!PROFILE_TAB_BY_ID[tab]) {
      router.replace("/profile/myProperties");
    }
  }, [router, tab]);

  const handleLogOut = async () => {
    setIsLoggingOut(true);
    try {
      await signOut(firebaseClientAuth);
      router.replace("/");
    } catch (error) {
      console.error(error);
      setIsLoggingOut(false);
    }
  };

  if (isLoggingOut) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#F8FAFC]">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-200 border-t-[#1F5FD6]" />
      </div>
    );
  }

  const panels: Record<string, ReactNode> = {
    myProperties:
      company || showSkeleton ? (
        <PropertiesTab
          company={company}
          userListings={ownListings}
          isLoading={showSkeleton}
          activeView={view}
        />
      ) : (
        <ProfilePageOwnListings initialListings={ownListings} />
      ),
    saved: <SavedItemsPageTabs activeView={view} />,
    myAccount: <PersonalDetailsTab />,
    company: <CompanyTab />,
    invites: <InvitesTab />,
    recentlyViewed: <RecentlyViewedListings />,
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-28 lg:pb-16">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase text-[#1F5FD6]">
                Account center
              </p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#2D3648] sm:text-4xl">
                {activeTab.title}
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-[#64748B]">
                {activeTab.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:min-w-[420px]">
              <div className="rounded-2xl border border-slate-200 bg-[#F8FAFC] px-4 py-3">
                <p className="text-xs font-semibold uppercase text-[#717D96]">
                  Own properties
                </p>
                <p className="mt-1 text-2xl font-semibold text-[#2D3648]">
                  {showSkeleton ? "-" : ownListings.length}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-[#F8FAFC] px-4 py-3">
                <p className="text-xs font-semibold uppercase text-[#717D96]">
                  Company
                </p>
                <p className="mt-1 truncate text-base font-semibold text-[#2D3648]">
                  {showSkeleton ? "-" : company?.name || "Not set"}
                </p>
              </div>
              <div className="col-span-2 rounded-2xl border border-slate-200 bg-[#F8FAFC] px-4 py-3 sm:col-span-1">
                <p className="text-xs font-semibold uppercase text-[#717D96]">
                  Total portfolio
                </p>
                <p className="mt-1 text-2xl font-semibold text-[#2D3648]">
                  {showSkeleton
                    ? "-"
                    : ownListings.length + companyListings.length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-screen-xl grid-cols-1 gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-8 lg:px-8 lg:py-8">
        <aside className="min-w-0 lg:sticky lg:top-24 lg:self-start">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-5 py-5">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#EAF2FF] text-lg font-semibold text-[#1F5FD6]">
                  {showSkeleton ? "" : getInitials(displayName)}
                </div>
                <div className="min-w-0">
                  {showSkeleton ? (
                    <>
                      <div className="mb-1 h-6 w-[130px] animate-pulse rounded bg-slate-200" />
                      <div className="h-5 w-[170px] animate-pulse rounded bg-slate-200" />
                    </>
                  ) : error ? (
                    <p className="text-sm font-semibold text-red-500">
                      Could not load profile
                    </p>
                  ) : (
                    <>
                      <p className="truncate font-semibold text-[#2D3648]">
                        {displayName}
                      </p>
                      <p className="truncate text-sm text-[#717D96]">{email}</p>
                    </>
                  )}
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 rounded-xl bg-[#F8FAFC] px-3 py-2 text-sm text-[#64748B]">
                <ShieldCheckIcon className="h-4 w-4 shrink-0 text-[#1F5FD6]" />
                <span className="truncate">
                  {company?.name
                    ? `Managing ${company.name}`
                    : "Private account"}
                </span>
              </div>
            </div>

            <nav
              aria-label="Profile navigation"
              className="flex gap-2 overflow-x-auto p-3 lg:flex-col lg:overflow-visible"
            >
              {PROFILE_TABS.map((item) => {
                const active = activeTab.id === item.id;

                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={`flex min-w-max items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition lg:min-w-0 ${
                      active
                        ? "bg-[#EAF2FF] text-[#1F5FD6]"
                        : "text-[#4A5468] hover:bg-[#F8FAFC] hover:text-[#1F5FD6]"
                    }`}
                  >
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                        active ? "bg-white" : "bg-[#F8FAFC]"
                      }`}
                    >
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              <button
                type="button"
                className="flex min-w-max items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-rose-600 transition hover:bg-rose-50 lg:mt-2 lg:min-w-0"
                onClick={handleLogOut}
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-rose-50">
                  <ArrowRightOnRectangleIcon className="h-5 w-5" />
                </span>
                <span>Log out</span>
              </button>
            </nav>
          </div>
        </aside>

        <main className="min-w-0 space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-5 shadow-sm sm:px-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase text-[#1F5FD6]">
                  {activeTab.label}
                </p>
                <h2 className="mt-1 text-xl font-semibold text-[#2D3648]">
                  {activeTab.title}
                </h2>
                <p className="mt-1 text-sm text-[#717D96]">
                  {activeTab.description}
                </p>
              </div>
              {activeTab.id === "myProperties" && (
                <Link
                  href="/placeproperties"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1F5FD6] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#184FB5]"
                >
                  <BriefcaseIcon className="h-4 w-4" />
                  Place property
                </Link>
              )}
            </div>
          </div>

          {panels[activeTab.id] ?? null}
        </main>
      </div>
    </div>
  );
};
