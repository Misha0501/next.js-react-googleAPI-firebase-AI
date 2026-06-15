import { useState } from "react";
import { ListingType } from "@/types";
import Filters, { FilterValues } from "@/app/components/listingsPage/Filters";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AdjustmentsHorizontalIcon,
  BuildingOffice2Icon,
  HomeModernIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

type Props = {
  onParamsChange: (data: FilterValues) => void;
  onListingTypeChange: (listingType: ListingType) => void;
  locality?: string;
  showFiltersMobile: () => void;
};
export const ListingsPageFilters = ({
  onParamsChange,
  onListingTypeChange,
  locality,
  showFiltersMobile,
}: Props) => {
  const params = useSearchParams();
  const router = useRouter();
  const [listingType, setListingType] = useState<ListingType>(
    (params.get("listingType") as ListingType) || "SELL",
  );

  const defaultFilters = (type: ListingType) => ({
    listingType: type,
    propertyType: [],
    priceRange: { min: undefined, max: undefined },
    livingAreaRange: { min: undefined, max: undefined },
    areaTotal: { min: undefined, max: undefined },
    roomRange: { min: undefined, max: undefined },
    bedroomRange: { min: undefined, max: undefined },
    listedSince: undefined,
  });

  const handleTabChange = (newType: "SELL" | "RENT") => {
    if (newType === listingType) return;

    setListingType(newType);
    onListingTypeChange(newType);
    onParamsChange(defaultFilters(newType));

    const qp = new URLSearchParams();
    const currentLocality = locality || params.get("locality");
    if (currentLocality) qp.set("locality", currentLocality);
    qp.set("listingType", newType);
    router.replace(`/listings?${qp.toString()}`);
  };

  const onChange = (data: FilterValues) => {
    onParamsChange(data);
    onListingTypeChange(listingType);
  };

  const tabs = [
    {
      label: "Buy",
      value: "SELL" as ListingType,
      icon: HomeModernIcon,
    },
    {
      label: "Rent",
      value: "RENT" as ListingType,
      icon: BuildingOffice2Icon,
    },
  ];

  return (
    <>
      <div className="mb-6 flex items-center justify-between lg:hidden">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF2FF] text-[#1F5FD6]">
            <AdjustmentsHorizontalIcon className="h-5 w-5" />
          </span>
          <div>
            <p className="text-lg font-bold text-[#1F2937]">Filters</p>
            <p className="text-sm text-[#717D96]">Refine your search</p>
          </div>
        </div>
        <button
          type="button"
          onClick={showFiltersMobile}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-[#2D3648] transition hover:border-[#CFE0FF] hover:text-[#1F5FD6]"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>

      <div className="mb-7 hidden lg:flex lg:items-center lg:gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF2FF] text-[#1F5FD6]">
          <AdjustmentsHorizontalIcon className="h-5 w-5" />
        </span>
        <div>
          <p className="text-lg font-bold text-[#1F2937]">Filters</p>
          <p className="text-sm text-[#717D96]">Refine your search</p>
        </div>
      </div>

      <div className="mb-8">
        <div
          className="grid grid-cols-2 gap-2 rounded-2xl bg-[#F1F5F9] p-1.5"
          role="tablist"
        >
          {tabs.map((item) => {
            const Icon = item.icon;
            const isActive = listingType === item.value;

            return (
              <button
                key={item.value}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`flex min-h-[48px] items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-black transition ${
                  isActive
                    ? "bg-[#1F5FD6] text-white shadow-sm"
                    : "text-[#334155] hover:bg-white hover:text-[#1F5FD6]"
                }`}
                onClick={() => handleTabChange(item.value)}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </button>
            );
          })}
        </div>
        <div className="mt-6" role="tabpanel">
          <Filters
            listingType={listingType}
            onParamsChange={onChange}
            locality={locality}
          />
        </div>
      </div>

      <button
        type="button"
        onClick={showFiltersMobile}
        className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-[#1F5FD6] px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#184FB5] lg:hidden"
      >
        Search
      </button>
    </>
  );
};
