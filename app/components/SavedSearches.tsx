"use client";

import { useEffect, useState } from "react";
import { getFetchUrl } from "@/app/lib/getFetchUrl";
import { useAuthContext } from "@/app/context/AuthContext";
import { SavedSearch } from "@/types";
import { XMarkIcon } from "@heroicons/react/24/solid";
export const SavedSearches = () => {
  const { authToken } = useAuthContext();

  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [savedSearchesTotal, setSavedSearchesTotal] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSavedSearches = async () => {
    // get the data from the api
    const response = await fetch(getFetchUrl(`/api/savedSearches`), {
      method: "GET",
      cache: "no-store",
      headers: {
        "Content-type": "application/json",
        "Authorization": authToken
      }
    });
    // convert the data to json
    const data = await response.json();

    // set saved searches
    setSavedSearches(data.results);

    // set state with the count
    setSavedSearchesTotal(data.total);

    // reset loading
    setIsLoading(false);
  };

  useEffect(() => {
    fetchSavedSearches().catch((error) => {
      console.error(error);
      setError(error.message);
    });

  }, []);

  return (
    <div className="mt-10 w-full">
      {isLoading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {!isLoading && !error && <div>
        <div className="flex justify-between items-baseline mb-10">
          <div className="text-xl"><span
            className={"font-bold"}>Results: </span> {savedSearchesTotal} {savedSearchesTotal === 0 || savedSearchesTotal > 1 ? "searches" : "search"} saved
          </div>
        </div>

        <div className={"flex flex-col gap-12"}>
          {savedSearches && savedSearches.map((item, index) => (
            <div className="p-8 flex flex-col bg-[#F7F9FC] hover:bg-[#ebeef2] hover:cursor-pointer rounded-xl" key={index}>
              <div className="flex justify-between py-3 font-bold text-xl">
                {item.locality && <span className={"w-1/2"}>{item.locality}</span>}
                {!item.locality && <span className={"w-1/2"}>Bulgaria</span>}
                <XMarkIcon className={"h-6 w-6"}/>
              </div>
              <div className="border-b flex justify-between py-3">
                <span className={"w-1/2 text-gray-500"}>Price</span>
                <span className={"w-1/2"}>x</span>
              </div>
              <div className="border-b flex justify-between py-3">
                <span className={"w-1/2 text-gray-500"}>Listed Since</span>
                <span className={"w-1/2"}>x</span>
              </div>
              <div className="border-b flex justify-between py-3">
                <span className={"w-1/2 text-gray-500"}>Listing type</span>
                <span className={"w-1/2"}>For sale</span>
              </div>
              <div className="border-b flex justify-between py-3">
                <span className={"w-1/2 text-gray-500"}>Square meters living area</span>
                <span className={"w-1/2"}>from 50</span>
              </div>
              <div className="border-b flex justify-between py-3">
                <span className={"w-1/2 text-gray-500"}>Rooms</span>
                <span className={"w-1/2"}>from 50</span>
              </div>
              <div className="border-b flex justify-between py-3">
                <span className={"w-1/2 text-gray-500"}>Bedrooms</span>
                <span className={"w-1/2"}>from 50</span>
              </div>
              <div className="border-b flex justify-between py-3">
                <span className={"w-1/2 text-gray-500"}>Search created</span>
                <span className={"w-1/2"}>{item.createdAt}</span>
              </div>
            </div>
          ))}
        </div>
      </div>}
    </div>
  );
};
