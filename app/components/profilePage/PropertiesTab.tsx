"use client";

import { useState } from "react";
import { ProfilePageOwnListings } from "@/app/components/profilePage/ProfilePageOwnListings";
import { Company, Listing } from "@/types";

type Props = {
  userListings: Listing[];
  company: Company | null;
  isLoading?: boolean;
};

const TAB_BASE =
  "flex min-h-11 flex-1 items-center justify-center whitespace-nowrap truncate rounded-t-lg border-b-2 px-4 pb-2 pt-3 text-sm font-semibold outline-none transition duration-150 focus-visible:ring-2 focus-visible:ring-[#1F5FD6]/25 md:flex-none md:min-w-40";
const TAB_ACTIVE = "border-[#1F5FD6] bg-[#1F5FD6]/5 text-[#1F5FD6]";
const TAB_INACTIVE =
  "border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-700";

export const PropertiesTab = ({ userListings, company, isLoading }: Props) => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="w-full">
      <div
        role="tablist"
        className="mb-10 flex w-full justify-start overflow-x-auto border-b border-gray-200 pb-2 md:w-fit md:overflow-x-visible"
      >
        {["Placed by you", "Company owned"].map((label, i) => (
          <button
            key={label}
            type="button"
            role="tab"
            aria-selected={activeIndex === i}
            className={`${TAB_BASE} ${activeIndex === i ? TAB_ACTIVE : TAB_INACTIVE}`}
            onClick={() => setActiveIndex(i)}
          >
            {label}
          </button>
        ))}
      </div>
      <div role="tabpanel">
        {activeIndex === 0 && (
          <ProfilePageOwnListings
            initialListings={userListings}
            isLoading={isLoading}
          />
        )}
        {activeIndex === 1 && (
          <ProfilePageOwnListings
            initialListings={company?.Listing || []}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
};
