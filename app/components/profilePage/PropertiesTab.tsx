"use client";

import Link from "next/link";
import { ProfilePageOwnListings } from "@/app/components/profilePage/ProfilePageOwnListings";
import { Company, Listing } from "@/types";
import {
  BuildingOffice2Icon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

type Props = {
  userListings: Listing[];
  company: Company | null;
  isLoading?: boolean;
  activeView?: string;
};

const VIEW_ITEMS = [
  {
    id: "personal",
    label: "Placed by you",
    href: "/profile/myProperties?view=personal",
    icon: <UserCircleIcon className="h-4 w-4" />,
  },
  {
    id: "company",
    label: "Company owned",
    href: "/profile/myProperties?view=company",
    icon: <BuildingOffice2Icon className="h-4 w-4" />,
  },
];

export const PropertiesTab = ({
  userListings,
  company,
  isLoading,
  activeView,
}: Props) => {
  const selectedView = activeView === "company" ? "company" : "personal";
  const listings =
    selectedView === "company"
      ? ((company?.Listing as Listing[] | undefined) ?? [])
      : userListings;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
        <div
          role="tablist"
          className="grid grid-cols-2 gap-2"
          aria-label="Property ownership"
        >
          {VIEW_ITEMS.map((item) => {
            const active = selectedView === item.id;
            const disabled = item.id === "company" && !company && !isLoading;

            return (
              <Link
                key={item.id}
                href={
                  disabled ? "/profile/myProperties?view=personal" : item.href
                }
                role="tab"
                aria-selected={active}
                className={`min-h-11 flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition ${
                  active
                    ? "bg-[#1F5FD6] text-white shadow-sm"
                    : disabled
                      ? "cursor-not-allowed bg-slate-50 text-slate-400"
                      : "text-[#4A5468] hover:bg-[#F8FAFC] hover:text-[#1F5FD6]"
                }`}
              >
                {item.icon}
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      <ProfilePageOwnListings
        initialListings={listings}
        isLoading={isLoading}
      />
    </div>
  );
};
