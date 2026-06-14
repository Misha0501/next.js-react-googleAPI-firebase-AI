"use client";

import { useState } from "react";
import { SavedListings } from "@/app/components/profilePage/SavedListings";
import { SavedSearches } from "@/app/components/profilePage/SavedSearches";

const TAB_BASE =
  "flex min-h-11 flex-1 items-center justify-center whitespace-nowrap truncate rounded-t-lg border-b-2 px-4 pb-2 pt-3 text-sm font-semibold outline-none transition duration-150 focus-visible:ring-2 focus-visible:ring-[#1F5FD6]/25 md:flex-none md:min-w-40";
const TAB_ACTIVE = "border-[#1F5FD6] bg-[#1F5FD6]/5 text-[#1F5FD6]";
const TAB_INACTIVE =
  "border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-700";

export const SavedItemsPageTabs = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="w-full">
      <div
        role="tablist"
        className="flex w-full justify-start overflow-x-auto border-b border-gray-200 pb-2 md:w-fit md:overflow-x-visible"
      >
        {["Properties", "Searches"].map((label, i) => (
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
        {activeIndex === 0 && <SavedListings />}
        {activeIndex === 1 && <SavedSearches />}
      </div>
    </div>
  );
};
