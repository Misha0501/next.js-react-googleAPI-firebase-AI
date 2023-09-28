"use client";

import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@tremor/react";
import { ProfilePageOwnListings } from "@/app/components/ProfilePageOwnListings";
import { Company, Listing } from "@/types";

type Props = {
  userListings: Listing[];
  company: Company | null;
};
export const PropertiesTab = ({ userListings, company }: Props) => {
    return (
      <div className="w-full">
          <TabGroup>
              <TabList className="space-x-0 w-min mb-10">
                  <Tab
                    className={"ui-selected:bg-gray-100 ui-selected:rounded-t-lg w-full justify-center px-4 pt-3"}>Place by you</Tab>
                  <Tab
                    className={"ui-selected:bg-gray-100 ui-selected:rounded-t-lg w-full justify-center px-4 pt-3"}>Company owned</Tab>
              </TabList>
              <TabPanels>
                  <TabPanel>
                      <ProfilePageOwnListings
                        initialListings={userListings}
                      ></ProfilePageOwnListings>
                  </TabPanel>
                  <TabPanel>
                      <ProfilePageOwnListings
                        initialListings={company?.Listing || []}
                      ></ProfilePageOwnListings>
                  </TabPanel>
              </TabPanels>
          </TabGroup>
      </div>
    );
}
