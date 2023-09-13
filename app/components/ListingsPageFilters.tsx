"use client";

import {
  Divider,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from "@tremor/react";
import { useState } from "react";
import { ListingType } from "@/types";
import Filters from "@/app/components/Filters";
import { useSearchParams } from "next/navigation";

export const ListingsPageFilters = ({ onParamsChange, listing }: any) => {
  const params = useSearchParams();
  const [listingType, setListingType] = useState<ListingType | any>(
    params.get("listingType")
  );
  const handleTabChange = (tabIndex: number) => {
    tabIndex == 0 ? setListingType("SELL") : setListingType("RENT");
  };

  const onChange = (data: any) => {
    onParamsChange(data);
    listing(listingType);
  };
  return (
    <div className="filters w-full md:max-w-[400px]">
      <div className={"flex items-center justify-between"}>
        <span className={"font-bold"}>Filters</span>

        <button className={"text-base text-gray-500 underline"}>
          Reset filters
        </button>
      </div>
      <Divider />
      <TabGroup
        defaultIndex={listingType === "SELL" ? 0 : 1}
        onIndexChange={handleTabChange}
      >
        <TabList className="mt-8 space-x-0">
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
                <Filters listingType={listingType} onParamsChange={onChange} />
              </>
            )}
          </TabPanel>
          <TabPanel>
            {listingType === "RENT" && (
              <Filters listingType={listingType} onParamsChange={onChange} />
            )}
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  );
};
