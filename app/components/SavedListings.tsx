"use client";

import { Select, SelectItem, Tab, TabGroup, TabList, TabPanel, TabPanels } from "@tremor/react";
import { useEffect, useState } from "react";
import { ListingItem } from "@/app/components/ListingItem";
import { getFetchUrl } from "@/app/lib/getFetchUrl";
import { useAuthContext } from "@/app/context/AuthContext";
import { ListBulletIcon } from "@heroicons/react/24/solid";
import { ListBulletIcon as ListBulletIconOutline } from "@heroicons/react/24/outline";
import { Listing, SavedListing } from "@/types";

const sortingByValues = ["Newest", "Price (low to high)", "Price (high to low)"];

export const SavedListings = () => {
  const { authToken } = useAuthContext();

  const [savedListings, setSavedListings] = useState<SavedListing[]>([]);
  const [savedListingsTotal, setSavedListingsTotal] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const handleSavedIconClick = (listing: ListingItem) => {
    if (!listing.savedListingId) return;

    fetch(getFetchUrl(`/api/savedListings/${listing.savedListingId}`), {
      method: "DELETE",
      cache: "no-store",
      headers: {
        "Content-type": "application/json",
        "Authorization": authToken
      }
    }).then(() => fetchSavedListings()).catch(error => {
      console.error(error.message);
    });
  };

  const fetchSavedListings = async () => {
    // get the data from the api
    const response = await fetch(getFetchUrl(`/api/savedListings`), {
      method: "GET",
      cache: "no-store",
      headers: {
        "Content-type": "application/json",
        "Authorization": authToken
      }
    });
    // convert the data to json
    const data = await response.json();
    const savedListings: SavedListing[] = data.results;

    // Populated listings with saved data
    const populatedListings = savedListings.map(savedListing => {
      savedListing.listing.savedListingId = savedListing.id;
      return savedListing;
    });

    // set state with the result
    setSavedListings(populatedListings);

    // set state with the count
    setSavedListingsTotal(data.total);

    // reset loading
    setIsLoading(false);
  };

  useEffect(() => {
    fetchSavedListings().catch((error) => {
      console.error(error);
      setError(error.message);
    });

  }, []);

  return (
    <div className="mt-10 w-full">
      {isLoading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {!isLoading && !error && <div>
        <div className="flex justify-between items-baseline">
          <div className="text-xl"><span
            className={"font-bold"}>Results: </span> {savedListingsTotal} {savedListingsTotal === 0 || savedListingsTotal > 1 ? "properties" : "property"} saved
          </div>
        </div>

        <div className={"grid grid-cols-3 gap-16 mt-10"}>
          {savedListings && savedListings.map((item, index) => (
            <ListingItem listingItem={item.listing} key={index} onSavedIconClick={handleSavedIconClick} />
          ))}
        </div>
      </div>}
    </div>
  );
};
