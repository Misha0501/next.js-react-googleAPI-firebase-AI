"use client";

import Link from "next/link";
import { SavedListings } from "@/app/components/profilePage/SavedListings";
import { SavedSearches } from "@/app/components/profilePage/SavedSearches";
import { HeartIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

type Props = {
  activeView?: string;
};

const SAVED_VIEWS = [
  {
    id: "properties",
    label: "Properties",
    href: "/profile/saved?view=properties",
    icon: <HeartIcon className="h-4 w-4" />,
  },
  {
    id: "searches",
    label: "Searches",
    href: "/profile/saved?view=searches",
    icon: <MagnifyingGlassIcon className="h-4 w-4" />,
  },
];

export const SavedItemsPageTabs = ({ activeView }: Props) => {
  const selectedView = activeView === "searches" ? "searches" : "properties";

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
        <div
          role="tablist"
          className="grid grid-cols-2 gap-2"
          aria-label="Saved items"
        >
          {SAVED_VIEWS.map((item) => {
            const active = selectedView === item.id;

            return (
              <Link
                key={item.id}
                href={item.href}
                role="tab"
                aria-selected={active}
                className={`min-h-11 flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition ${
                  active
                    ? "bg-[#1F5FD6] text-white shadow-sm"
                    : "text-[#4A5468] hover:bg-[#F8FAFC] hover:text-[#1F5FD6]"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {selectedView === "properties" && <SavedListings />}
      {selectedView === "searches" && <SavedSearches />}
    </div>
  );
};
