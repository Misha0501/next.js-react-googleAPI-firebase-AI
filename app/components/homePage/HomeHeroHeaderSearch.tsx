"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Autocomplete from "@/app/components/Autocomplete";

type ListingType = "SELL" | "RENT";

export function HomeHeroHeaderSearch() {
  const [listingTypeSelected, setListingTypeSelected] = useState<ListingType>("SELL");
  const [selectedLocality, setSelectedLocality] = useState("");
  const router = useRouter();

  const popularSearches = [
    { locality: "Sofia", href: "sofia" },
    { locality: "Plovdiv", href: "plovdiv" },
    { locality: "Varna", href: "varna" },
    { locality: "Burgas", href: "burgas" },
    { locality: "Ruse", href: "ruse" },
    { locality: "Pleven", href: "pleven" },
    { locality: "Sliven", href: "sliven" },
  ];

  const handleSelectedLocalityChange = (locality: string) => {
    router.push(`/listings?listingType=${listingTypeSelected}&locality=${locality}`);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const url = `/listings?listingType=${listingTypeSelected}${
      selectedLocality ? `&locality=${selectedLocality}` : ""
    }`;
    router.push(url);
  };

  const tabBase =
    "w-full rounded-lg border py-2 px-3 text-sm font-bold leading-6 outline-none transition-colors focus:outline-none active:outline-none";
  const tabActive = "border-[#1F5FD6] bg-[#1F5FD6] text-white shadow-sm";
  const tabInactive = "border-transparent bg-[#EFF6FF] text-[#1E3A8A] hover:bg-[#DBEAFE]";

  return (
    <>
      <form
        className={"flex flex-col justify-center items-center"}
        onSubmit={handleSubmit}
        onKeyDown={(e) => {
          e.key === "Enter" && e.preventDefault();
        }}
      >
        <div
          role="tablist"
          className="flex gap-1.5 rounded-xl border border-white/70 bg-white/95 p-1.5 mb-5 w-full max-w-[300px] shadow-[0_18px_50px_rgba(15,23,42,0.18)] backdrop-blur"
        >
          <button
            type="button"
            role="tab"
            aria-selected={listingTypeSelected === "SELL"}
            className={`${tabBase} ${listingTypeSelected === "SELL" ? tabActive : tabInactive}`}
            onClick={() => setListingTypeSelected("SELL")}
          >
            Buy
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={listingTypeSelected === "RENT"}
            className={`${tabBase} ${listingTypeSelected === "RENT" ? tabActive : tabInactive}`}
            onClick={() => setListingTypeSelected("RENT")}
          >
            Rent
          </button>
        </div>

        <div className="relative max-w-2xl w-full flex items-center mb-10">
          <Autocomplete
            // className="hero__search w-full p-3 pl-8 rounded-l-lg outline-0 focus:outline-none text-black"
            onLocalityChange={handleSelectedLocalityChange}
          />
        </div>
        <div className="hero__popular-searches">
          <div className={"font-bold mb-2 text-xl"}>Popular searches</div>
          <div className="space-x-3">
            {popularSearches.map((item) => (
              <Link
                key={item.href}
                href={`listings?locality=${item.locality}&listingType=${listingTypeSelected}`}
                className={"hover:underline"}
              >
                {item.locality}
              </Link>
            ))}
          </div>
        </div>
        <button type={"submit"} hidden>
          Search
        </button>
      </form>
    </>
  );
}
