'use client';

import {Select, SelectItem, Tab, TabGroup, TabList, TabPanel, TabPanels} from "@tremor/react";
import {useEffect, useState} from "react";
import {ListingItem} from "@/app/components/ListingItem";
import {getFetchUrl} from "@/app/lib/getFetchUrl";
import {useAuthContext} from "@/app/context/AuthContext";
import {ListBulletIcon} from "@heroicons/react/24/solid";
import {ListBulletIcon as ListBulletIconOutline} from "@heroicons/react/24/outline";
import {Listing, SavedListing} from "@/types";

const sortingByValues = ["Newest", "Price (low to high)", "Price (high to low)"];

export const SavedItemsPageTabs = () => {
    const {authToken} = useAuthContext()

    const handleTabChange = (tabIndex: number) => {
        console.log("Tab changed")
    }
    const [savedListings, setSavedListings] = useState<SavedListing[]>([])
    const [savedListingsTotal, setSavedListingsTotal] = useState()
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')
    const [sortingBySelected, setSortingBySelected] = useState(sortingByValues[0]);

    const handleSavedIconClick = (listing: ListingItem) => {
        if (!listing.savedListingId) return;

        fetch(getFetchUrl(`api/savedListings/${listing.savedListingId}`), {
            method: 'DELETE',
            cache: 'no-store',
            headers: {
                'Content-type': 'application/json',
                'Authorization': authToken,
            },
        }).then(() => fetchSavedListings()).catch(error => {
            console.error(error.message)
        })
    }

    const fetchSavedListings = async () => {
        // get the data from the api
        const response = await fetch(getFetchUrl(`/api/savedListings`), {
            method: 'GET',
            cache: 'no-store',
            headers: {
                'Content-type': 'application/json',
                'Authorization': authToken,
            }
        })
        // convert the data to json
        const data = await response.json();
        const savedListings: SavedListing[] = data.results;

        // Populated listings with saved data
        const populatedListings = savedListings.map(savedListing => {
            savedListing.listing.savedListingId = savedListing.id;
            return savedListing;
        })

        // set state with the result
        setSavedListings(populatedListings)

        // set state with the count
        setSavedListingsTotal(data.total)

        // reset loading
        setIsLoading(false);
    }

    useEffect(() => {
        fetchSavedListings().catch((error) => {
            console.error(error);
            setError(error.message);
        });

    }, [])

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
                        <div className="mt-10">
                            {isLoading && <p>Loading...</p>}
                            {error && <p>{error}</p>}
                            {!isLoading && !error && <div>
                                <div className="flex justify-between items-baseline">
                                    <div className="text-xl"><span
                                        className={"font-bold"}>Results: </span> {savedListingsTotal} {savedListingsTotal === 0 || savedListingsTotal > 1 ? 'properties' : 'property'} saved
                                    </div>
                                    {/*<div className="flex gap-7">*/}
                                    {/*    <div className="flex gap-3">*/}
                                    {/*        <ListBulletIcon className={"h-11 w-11 text-gray-500"}></ListBulletIcon>*/}
                                    {/*        <ListBulletIconOutline className={"h-11 w-11"}></ListBulletIconOutline>*/}
                                    {/*    </div>*/}
                                    {/*    <div>*/}
                                    {/*        <Select defaultValue={sortingBySelected}*/}
                                    {/*                onValueChange={setSortingBySelected}*/}
                                    {/*                className={"text-sm min-w-[300px]"}>*/}
                                    {/*            {sortingByValues.map((item, index) => (*/}
                                    {/*                <SelectItem value={item} key={index}><span className={"font-bold"}>Sort by:</span> {item}*/}
                                    {/*                </SelectItem>*/}
                                    {/*            ))}*/}
                                    {/*        </Select>*/}
                                    {/*    </div>*/}
                                    {/*</div>*/}

                                </div>

                                <div className={"grid grid-cols-3 gap-16 mt-10"}>
                                    {savedListings && savedListings.map((item, index) => (
                                        <ListingItem listingItem={item.listing} key={index} onSavedIconClick={handleSavedIconClick} />
                                    ))}
                                </div>
                            </div>}
                        </div>
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
