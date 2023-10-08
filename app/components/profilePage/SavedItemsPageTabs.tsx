"use client";

import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@tremor/react";
import { SavedListings } from "@/app/components/profilePage/SavedListings";
import { SavedSearches } from "@/app/components/profilePage/SavedSearches";

export const SavedItemsPageTabs = () => {
  return (
    <div className="w-full">
      <TabGroup>
        <TabList className="space-x-0 w-min">
          <Tab
            className={
              "ui-selected:bg-gray-100 ui-selected:rounded-t-lg w-full justify-center px-4 pt-3"
            }
          >
            Properties
          </Tab>
          <Tab
            className={
              "ui-selected:bg-gray-100 ui-selected:rounded-t-lg w-full justify-center px-4 pt-3"
            }
          >
            Searches
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <SavedListings />
          </TabPanel>
          <TabPanel>
            <SavedSearches />
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  );
};
