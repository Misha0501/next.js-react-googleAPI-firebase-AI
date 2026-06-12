"use client";
import { Tab } from "@headlessui/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { classNamesJoin } from "@/app/lib/classNamesJoin";
import Autocomplete from "@/app/components/Autocomplete";

export function HomeHeroHeaderSearch() {
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
      locality: "Sliven",
      href: "sliven",
    },
  ];

  const handleSelectedLocalityChange = (locality: string) => {
    router.push(
      `/listings?listingType=${listingTypeSelected}&locality=${locality}`,
    );
  };

  useEffect(() => {
    setListingTypeSelected(listingTypeSelectedIndex === 0 ? "SELL" : "RENT");
  }, [listingTypeSelectedIndex]);

  const handleSubmit = (e: any) => {
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
          <Tab.List className="flex gap-1.5 rounded-xl border border-white/70 bg-white/95 p-1.5 mb-5 w-full max-w-[300px] shadow-[0_18px_50px_rgba(15,23,42,0.18)] backdrop-blur">
            <Tab
              className={({ selected }) =>
                classNamesJoin(
                  "w-full rounded-lg border py-2 px-3 text-sm font-bold leading-6 outline-none transition-colors focus:outline-none active:outline-none",
                  selected
                    ? "border-tremor-brand bg-tremor-brand text-white shadow-sm"
                    : "border-transparent bg-[#EFF6FF] text-[#1E3A8A] hover:bg-[#DBEAFE]",
                )
              }
            >
              Buy
            </Tab>
            <Tab
              className={({ selected }) =>
                classNamesJoin(
                  // "ring-white ring-opacity-60 focus:outline-none ",
                  "w-full rounded-lg border py-2 px-3 text-sm font-bold leading-6 outline-none transition-colors focus:outline-none active:outline-none",
                  selected
                    ? "border-tremor-brand bg-tremor-brand text-white shadow-sm"
                    : "border-transparent bg-[#EFF6FF] text-[#1E3A8A] hover:bg-[#DBEAFE]",
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
