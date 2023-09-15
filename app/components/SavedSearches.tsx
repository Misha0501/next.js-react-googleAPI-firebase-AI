"use client";

import { Fragment, useEffect, useState } from "react";
import { getFetchUrl } from "@/app/lib/getFetchUrl";
import { useAuthContext } from "@/app/context/AuthContext";
import { Listing, SavedSearch } from "@/types";
import { TrashIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { Dialog, Transition } from "@headlessui/react";

export const SavedSearches = () => {
  const { authToken } = useAuthContext();

  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [savedSearchesTotal, setSavedSearchesTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  let [deleteConfirmationModalOpen, setDeleteConfirmationModalOpen] = useState(false);
  const [searchToDelete, setSearchToDelete] = useState<SavedSearch | null>(null);
  function closeModal() {
    setDeleteConfirmationModalOpen(false);
  }

  const onDeleteClick = (item: SavedSearch) => {
    setDeleteConfirmationModalOpen(true);
    setSearchToDelete(item);
  };
  const confirmDelete = () => {
    console.log("Delete saved search");

    if(!searchToDelete) return;

    const filteredSearches = savedSearches.filter(item => item.id !== searchToDelete.id);
    setSavedSearches(filteredSearches);
    setSavedSearchesTotal(savedSearchesTotal - 1);
    setSearchToDelete(null)
    closeModal();

    fetch(getFetchUrl(`api/savedSearches/${searchToDelete.id}`), {
      method: 'DELETE',
      cache: 'no-store',
      headers: {
        'Content-type': 'application/json',
        'Authorization': authToken,
      },
    }).catch(error => {
      console.error(error.message)
    })
  }
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
            <div className="p-8 flex flex-col bg-[#F7F9FC] rounded-xl"
                 key={index}>
              <div className="flex justify-between py-3 font-bold text-xl">
                {item.locality && <span className={"w-1/2"}>{item.locality}</span>}
                {!item.locality && <span className={"w-1/2"}>Bulgaria</span>}
                {/*<XMarkIcon className={"h-6 w-6"} />*/}
              </div>
              {(item.priceMin || item.priceMax) &&
                <div className="border-b flex justify-between py-3">
                <span className={"w-1/2 text-gray-500"}>Price</span>
                <span className={"w-1/2"}>From {item.priceMin || "-"} to {item.priceMax || "-"}</span>
              </div>}
              {item.listingType &&
              <div className="border-b flex justify-between py-3">
                <span className={"w-1/2 text-gray-500"}>Listing type</span>
                <span className={"w-1/2"}>{item.listingType === "SELL" ? "Buy" : "Rent"}</span>
              </div>
              }
              {(item.propertyType && item.propertyType.length > 0) &&
                <div className="border-b flex justify-between py-3">
                  <span className={"w-1/2 text-gray-500"}>Property types</span>
                  <span className={"w-1/2"}>{item.propertyType.map(value => value + "  ")}</span>
                </div>
              }
              {(item.areaTotalMin || item.areaTotalMax) &&
              <div className="border-b flex justify-between py-3">
                <span className={"w-1/2 text-gray-500"}>Area total</span>
                <span className={"w-1/2"}>From {item.areaTotalMin || "-"} to {item.areaTotalMax || "-"}</span>
              </div>
              }
              {(item.areaLivingMin || item.areaLivingMax) &&
                <div className="border-b flex justify-between py-3">
                  <span className={"w-1/2 text-gray-500"}>Area living</span>
                  <span className={"w-1/2"}>From {item.areaLivingMin || "-"} to {item.areaLivingMax || "-"}</span>
                </div>
              }
              {(item.roomsMin || item.roomsMax) &&
              <div className="border-b flex justify-between py-3">
                <span className={"w-1/2 text-gray-500"}>Rooms</span>
                <span className={"w-1/2"}>From {item.roomsMin || "-"} to {item.roomsMax || "-"}</span>
              </div>
              }
              {(item.bedroomsMin || item.bedroomsMax) &&
                <div className="border-b flex justify-between py-3">
                <span className={"w-1/2 text-gray-500"}>Bedrooms</span>
                  <span className={"w-1/2"}>From {item.bedroomsMin || "-"} to {item.bedroomsMax || "-"}</span>
              </div>
              }
              <div className="border-b flex justify-between py-3">
                <span className={"w-1/2 text-gray-500"}>Search created</span>
                <span className={"w-1/2"}>{item.createdAt}</span>
              </div>
              <div className={"flex items-center gap-2 text-red-600 cursor-pointer mt-4 w-fit"}
                   onClick={() => onDeleteClick(item)}>
                <TrashIcon className={"h-8 w-8"} />
                <span>Delete</span>
              </div>
            </div>
          ))}
        </div>
      </div>}
      <Transition appear show={deleteConfirmationModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel
                  className="w-full max-w-md transform overflow-hidden rounded-xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Are you sure you want to delete your saved search?
                  </Dialog.Title>
                  <div className="flex justify-between mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={closeModal}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={confirmDelete}
                    >
                      Yes, delete
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};
