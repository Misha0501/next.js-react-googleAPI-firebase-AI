import { Button } from "@tremor/react";
import { useState } from "react";
import { ListingType } from "@/types";
import Filters from "@/app/components/listingsPage/Filters";
import { useRouter, useSearchParams } from "next/navigation";
import { XMarkIcon } from "@heroicons/react/24/solid";

type Props = {
  onParamsChange: (data: any) => void;
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
  const [listingType, setListingType] = useState<ListingType | any>(
    params.get("listingType") || "SELL",
  );
  const [filterValues, setFilterValues] = useState({});

  const handleTabChange = (newType: "SELL" | "RENT") => {
    setListingType(newType);
    const qp = new URLSearchParams(params.toString());
    qp.set("listingType", newType);
    qp.delete("page");
    router.replace(`/listings?${qp.toString()}`);
  };

  const onChange = (data: any) => {
    onParamsChange(data);
    setFilterValues(data);
    onListingTypeChange(listingType);
  };

  const tabBase =
    "w-full text-center px-4 pt-3 pb-2 text-sm font-medium border-b-2 transition-colors";
  const tabActive = "border-blue-500 text-blue-600 bg-gray-100 rounded-t-lg";
  const tabInactive = "border-transparent text-gray-500 hover:text-gray-700";

  return (
    <>
      <div
        className={"flex justify-end lg:hidden cursor-pointer"}
        onClick={showFiltersMobile}
      >
        <XMarkIcon className="text-[#2D3648] h-6 w-6 text-lg" />
      </div>

      <div className="my-8">
        <div className="flex" role="tablist">
          <button
            role="tab"
            aria-selected={listingType === "SELL"}
            className={`${tabBase} ${listingType === "SELL" ? tabActive : tabInactive}`}
            onClick={() => handleTabChange("SELL")}
          >
            Buy
          </button>
          <button
            role="tab"
            aria-selected={listingType === "RENT"}
            className={`${tabBase} ${listingType === "RENT" ? tabActive : tabInactive}`}
            onClick={() => handleTabChange("RENT")}
          >
            Rent
          </button>
        </div>
        <div role="tabpanel">
          {listingType === "SELL" && (
            <Filters listingType={listingType} onParamsChange={onChange} locality={locality} />
          )}
          {listingType === "RENT" && (
            <Filters listingType={listingType} onParamsChange={onChange} locality={locality} />
          )}
        </div>
      </div>

      <Button
        type="button"
        onClick={showFiltersMobile}
        variant={"primary"}
        className={"w-full lg:hidden"}
      >
        Search
      </Button>
    </>
  );
};
