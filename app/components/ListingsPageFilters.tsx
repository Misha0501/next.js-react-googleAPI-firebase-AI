"use client";

import {Divider, Icon, Tab, TabGroup, TabList, TabPanel, TabPanels,} from "@tremor/react";
import {Fragment, useState} from "react";
import {ListingType} from "@/types";
import Filters from "@/app/components/Filters";
import {useSearchParams} from "next/navigation";
import {XMarkIcon} from "@heroicons/react/24/solid";

export const ListingsPageFilters = ({
  onParamsChange,
  onListingTypeChange,
  locality,
  showDrawerFunction,
}: any) => {
  const params = useSearchParams();
  const [listingType, setListingType] = useState<ListingType | any>(
    params.get("listingType") || "SELL"
  );
  const [filterValues, setFilterValues] = useState({});

  const handleTabChange = (tabIndex: number) => {
    tabIndex == 0 ? setListingType("SELL") : setListingType("RENT");
  };

  const onChange = (data: any) => {
    onParamsChange(data);
    setFilterValues(data);
    onListingTypeChange(listingType);
  };

  return (
    <div className="filters w-full py-6 lg:p-0 max-w-sm m-auto md:max-w-md">
      <div className={"flex items-center justify-between"}>
        <button
          type="button"
          onClick={showDrawerFunction}
          className=" bg-transparent  hover:bg-gray-200 hover:text-gray-900 rounded-lg text-2xl font-semibold items-center justify-center dark:hover:bg-gray-600 dark:hover:text-white lg:hidden"
        >
          <Icon className="text-[#2D3648] h-18 w-18 text-lg" icon={XMarkIcon} />
        </button>
      </div>
      <Divider />

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
