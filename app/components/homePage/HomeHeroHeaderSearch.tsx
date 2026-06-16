"use client";
import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Autocomplete from "@/app/components/shared/Autocomplete";
import {
  BuildingOffice2Icon,
  HomeModernIcon,
} from "@heroicons/react/24/outline";

type ListingType = "SELL" | "RENT";

export const HomeHeroHeaderSearch = () => {
  const [listingTypeSelected, setListingTypeSelected] =
    useState<ListingType>("SELL");
  const [selectedLocality, setSelectedLocality] = useState("");
  const router = useRouter();

  const popularSearches = [
    { locality: "Sofia", href: "sofia" },
    { locality: "Plovdiv", href: "plovdiv" },
    { locality: "Varna", href: "varna" },
    { locality: "Burgas", href: "burgas" },
    { locality: "Ruse", href: "ruse" },
  ];

  const handleSelectedLocalityChange = (locality: string) => {
    setSelectedLocality(locality);
    router.push(
      `/listings?listingType=${listingTypeSelected}&locality=${locality}`,
    );
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const locality = String(formData.get("locality") || selectedLocality);
    const url = `/listings?listingType=${listingTypeSelected}${
      locality ? `&locality=${locality}` : ""
    }`;
    router.push(url);
  };

  const searchModeTabs = [
    { label: "Buy", value: "SELL" as ListingType, icon: HomeModernIcon },
    { label: "Rent", value: "RENT" as ListingType, icon: BuildingOffice2Icon },
  ];

  return (
    <form className="w-full" onSubmit={handleSubmit}>
      <div className="mb-3 flex justify-center gap-1.5">
        {searchModeTabs.map((item) => {
          const Icon = item.icon;
          const isSelected = listingTypeSelected === item.value;
          return (
            <button
              key={item.value}
              type="button"
              role="tab"
              aria-selected={isSelected}
              className={`flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-bold transition-all duration-200 ${
                isSelected
                  ? "bg-white text-[#1F5FD6] shadow-md"
                  : "bg-white/12 border border-white/40 text-white hover:bg-white/20"
              }`}
              onClick={() => setListingTypeSelected(item.value)}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </button>
          );
        })}
      </div>

      <div className="w-full">
        <Autocomplete
          onLocalityChange={handleSelectedLocalityChange}
          variant="hero"
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-x-2 gap-y-2">
        <span className="text-white/45 text-xs font-semibold uppercase tracking-widest">
          Popular:
        </span>
        {popularSearches.map((item) => (
          <Link
            key={item.href}
            href={`/listings?locality=${item.locality}&listingType=${listingTypeSelected}`}
            className="rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-white/80 backdrop-blur transition-all duration-200 hover:bg-white/20 hover:text-white"
          >
            {item.locality}
          </Link>
        ))}
      </div>

      <button type="submit" hidden>
        Search
      </button>
    </form>
  );
};
