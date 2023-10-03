"use client";
import { Tab } from "@headlessui/react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { classNames } from "@/app/lib/classNames";
import Autocomplete from "@/app/components/Autocomplete";

export function HomeHeroHeaderSearch({ setListingType }: any) {
  const [listingTypeSelectedIndex, setListingTypeSelectedIndex] = useState(0);
  const [listingTypeSelected, setListingTypeSelected] = useState("SELL");
  const [selectedLocality, setSelectedLocality] = useState("");
  const router = useRouter();

  let popularSearches = [
    {
      locality: "Sofia",
      href: "sofia",
    },
    {
      locality: "Plovdiv",
      href: "plovdiv",
    },
    {
      locality: "Varna",
      href: "varna",
    },
    {
      locality: "Burgas",
      href: "burgas",
    },
    {
      locality: "Ruse",
      href: "ruse",
    },
    {
      locality: "Pleven",
      href: "pleven",
    },
    {
      locality: "Silven",
      href: "silven",
    },
  ];

  const handleSelectedLocalityChange = (locality: string) => {
    router.push(
      `/listings?listingType=${listingTypeSelected}&locality=${locality}`
    );
  };

  useEffect(() => {
    setListingTypeSelected(listingTypeSelectedIndex === 0 ? "SELL" : "RENT");
    setListingType(listingTypeSelectedIndex === 0 ? "SELL" : "RENT");
  }, [listingTypeSelectedIndex]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const url = `/listings?listingType=${listingTypeSelected}${
      selectedLocality ? `&locality=${selectedLocality}` : ""
    }`;
    router.push(url);
  };

  return (
    <>
      <form
        className={"flex flex-col justify-center items-center"}
        onSubmit={handleSubmit}
        onKeyDown={(e) => {
          // Prevent submit on enter
          e.key === "Enter" && e.preventDefault();
        }}
      >
        <Tab.Group
          selectedIndex={listingTypeSelectedIndex}
          onChange={setListingTypeSelectedIndex}
        >
          <Tab.List className="flex gap-2 p-1 mb-5 w-full max-w-[300px]">
            <Tab
              className={({ selected }) =>
                classNames(
                  "w-full rounded-lg py-2 px-3 text-sm font-bold leading-6 outline-none focus:outline-none active:outline-none",
                  selected
                    ? "bg-[#97B6FF] text-white"
                    : "text-[#222222] bg-[#F2F2F2]"
                )
              }
            >
              Buy
            </Tab>
            <Tab
              className={({ selected }) =>
                classNames(
                  // "ring-white ring-opacity-60 focus:outline-none ",
                  "w-full rounded-lg py-2 px-3 text-sm font-bold leading-6 outline-none focus:outline-none active:outline-none",
                  selected
                    ? "bg-[#97B6FF] text-white"
                    : "text-[#222222] bg-[#F2F2F2]"
                )
              }
            >
              Rent
            </Tab>
          </Tab.List>
        </Tab.Group>

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
