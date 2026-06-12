import {
  Button,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from "@tremor/react";
import { Fragment, useState } from "react";
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

  const handleTabChange = (tabIndex: number) => {
    const newType = tabIndex === 0 ? "SELL" : "RENT";
    setListingType(newType);
    const qp = new URLSearchParams(params.toString());
    qp.set("listingType", newType);
    router.replace(`/listings?${qp.toString()}`);
  };

  const onChange = (data: any) => {
    onParamsChange(data);
    setFilterValues(data);
    onListingTypeChange(listingType);
  };

  return (
    <>
      <div
        className={"flex justify-end lg:hidden cursor-pointer"}
        onClick={showFiltersMobile}
      >
        <XMarkIcon className="text-[#2D3648] h-6 w-6 text-lg" />
      </div>
      <TabGroup
        defaultIndex={listingType === "SELL" ? 0 : 1}
        onIndexChange={handleTabChange}
      >
        <TabList className="my-8 space-x-0">
          <Tab
            className={
              "ui-selected:bg-gray-100 ui-selected:rounded-t-lg w-full justify-center px-4 pt-3"
            }
          >
            Buy
          </Tab>
          <Tab
            className={
              "ui-selected:bg-gray-100 ui-selected:rounded-t-lg w-full justify-center px-4 pt-3"
            }
          >
            Rent
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            {listingType === "SELL" && (
              <>
                <Filters listingType={listingType} onParamsChange={onChange} locality={locality} />
              </>
            )}
          </TabPanel>
          <TabPanel>
            {listingType === "RENT" && (
              <Filters listingType={listingType} onParamsChange={onChange} locality={locality} />
            )}
          </TabPanel>
        </TabPanels>
      </TabGroup>
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
