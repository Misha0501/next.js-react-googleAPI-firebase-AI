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
  "flex whitespace-nowrap truncate max-w-xs outline-none focus:ring-0 text-sm transition duration-100 -mb-px w-full justify-center px-4 pt-3";
const TAB_ACTIVE = "bg-gray-100 rounded-t-lg border-b-2 border-[#1F5FD6] text-[#1F5FD6]";
const TAB_INACTIVE =
  "border-b border-transparent text-gray-500 hover:border-b-2 hover:border-gray-500 hover:text-gray-700";

export const PropertiesTab = ({ userListings, company, isLoading }: Props) => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="w-full">
      <div
        role="tablist"
        className="flex border-b border-gray-200 justify-start overflow-x-clip space-x-0 w-min mb-10"
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
          <ProfilePageOwnListings initialListings={userListings} isLoading={isLoading} />
        )}
        {activeIndex === 1 && (
          <ProfilePageOwnListings initialListings={company?.Listing || []} isLoading={isLoading} />
        )}
      </div>
    </div>
  );
};
