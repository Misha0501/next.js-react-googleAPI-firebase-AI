"use client";

import { Button, Divider, Tab, TabGroup, TabList, TabPanel, TabPanels } from "@tremor/react";
import { Fragment, useState } from "react";
import { ListingType } from "@/types";
import Filters from "@/app/components/Filters";
import { useSearchParams } from "next/navigation";
import { useAuthContext } from "@/app/context/AuthContext";
import { getFetchUrl } from "@/app/lib/getFetchUrl";
import { Dialog, Transition } from "@headlessui/react";
import Link from "next/link";

export const ListingsPageFilters = ({ onParamsChange, listing }: any) => {
  const { authToken } = useAuthContext();

  const params = useSearchParams();
  const [listingType, setListingType] = useState<ListingType | any>(
    params.get("listingType")
  );
  const [filterValues, setFilterValues] = useState({});
  let [savedSearchConfirmationModal, setSavedSearchConfirmationModal] = useState(false);
  let [savedSearchError, setSavedSearchError] = useState("");

  function closeModal() {
    setSavedSearchConfirmationModal(false);
  }

  const handleTabChange = (tabIndex: number) => {
    tabIndex == 0 ? setListingType("SELL") : setListingType("RENT");
  };

  const onChange = (data: any) => {
    onParamsChange(data);
    setFilterValues(data);
    listing(listingType);
  };

  const handleResetFilters = () => {
    console.log("reset filters");
    console.log(filterValues);
  };

  const handleSaveSearch = async () => {
    try {
      const response = await fetch(getFetchUrl(`api/savedSearches`), {
        method: "POST",
        cache: "no-store",
        headers: {
          "Content-type": "application/json",
          Authorization: authToken
        },
        body: JSON.stringify(filterValues)
      });
      const data = await response.json();

      if (response.status !== 200) {
        console.error("Error response:", response);
        console.error("Error data:", data);
        setSavedSearchError("Something went wrong, please try again later.");
        setSavedSearchConfirmationModal(true);
        return;
      }
      setSavedSearchConfirmationModal(true);

    } catch (e) {
      console.error("error");
      console.error(e);
      setSavedSearchError("Something went wrong, please try again later.");
      setSavedSearchConfirmationModal(true);
    }
  };
  return (
    <div className="filters w-full md:max-w-[400px]">
      <div className={"flex items-center justify-between"}>
        <Button className={"font-bold"} variant={"secondary"} onClick={handleSaveSearch}>Save search</Button>

        <button className={"text-base text-gray-500 underline"} onClick={handleResetFilters}>
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
                <Filters listingType={listingType} onParamsChange={onChange} listintType={"SELL"} />
              </>
            )}
          </TabPanel>
          <TabPanel>
            {listingType === "RENT" && (
              <Filters listingType={listingType} onParamsChange={onChange} listintType={"RENT"} />
            )}
          </TabPanel>
        </TabPanels>
      </TabGroup>

      {/* Confirmation modal*/}
      <Transition appear show={savedSearchConfirmationModal} as={Fragment}>
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

                  {savedSearchError && <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Oops! Something went wrong. Please try again later.
                  </Dialog.Title>
                  }
                  {!savedSearchError && <div>
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >

                      Your search has been saved! 🎉
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        You will be notified via email when new listings match your search criteria.
                      </p>
                      <p className="text-sm text-gray-500">
                        You can manage your saved searches in your&nbsp;<Link href={"/profile"}
                                                                              className={"text-blue-500 underline"}>profile</Link>.
                      </p>
                    </div>
                  </div>}

                  <div className="flex justify-between mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={closeModal}
                    >
                      Got it, thanks!
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
