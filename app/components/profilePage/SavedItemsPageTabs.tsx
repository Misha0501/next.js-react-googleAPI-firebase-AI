"use client";

import { useState } from "react";
import { SavedListings } from "@/app/components/profilePage/SavedListings";
import { SavedSearches } from "@/app/components/profilePage/SavedSearches";

const TAB_BASE =
  "flex whitespace-nowrap truncate max-w-xs outline-none focus:ring-0 text-sm transition duration-100 -mb-px w-full justify-center px-4 pt-3";
const TAB_ACTIVE = "bg-gray-100 rounded-t-lg border-b-2 border-[#1F5FD6] text-[#1F5FD6]";
const TAB_INACTIVE =
  "border-b border-transparent text-gray-500 hover:border-b-2 hover:border-gray-500 hover:text-gray-700";

export const SavedItemsPageTabs = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="w-full">
      <div
        role="tablist"
        className="flex border-b border-gray-200 justify-start overflow-x-clip space-x-0 w-min"
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
