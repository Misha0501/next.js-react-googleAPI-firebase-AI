'use client';

import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@tremor/react";
import { useState } from "react";
import { useAuthContext } from "@/app/context/AuthContext";
import { SavedListings } from "@/app/components/SavedListings";

const sortingByValues = ["Newest", "Price (low to high)", "Price (high to low)"];

export const SavedItemsPageTabs = () => {
    const {authToken} = useAuthContext()
    const handleTabChange = (tabIndex: number) => {
        console.log("Tab changed")
    }
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')
    return (
        <div className="w-full">
            <TabGroup onIndexChange={handleTabChange}>
                <TabList className="mt-8 space-x-0 w-min">
                    <Tab
                        className={"ui-selected:bg-gray-100 ui-selected:rounded-t-lg w-full justify-center px-4 pt-3"}>Properties</Tab>
                    <Tab
                        className={"ui-selected:bg-gray-100 ui-selected:rounded-t-lg w-full justify-center px-4 pt-3"}>Searches</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <SavedListings/>
                    </TabPanel>
                    <TabPanel>
                        {isLoading && <p>Loading...</p>}
                        {error && <p>{error}</p>}
                        Saved searches
                    </TabPanel>
                </TabPanels>
            </TabGroup>
        </div>
    );
}
