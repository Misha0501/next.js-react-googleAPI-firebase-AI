"use client";
import { ListingsMain } from "@/app/components/ListingsMain";
import { ListingsPageHeader } from "@/app/components/ListingsPageHeader";
import { ListingsPageFilters } from "@/app/components/ListingsPageFilters";
import { Fragment, useCallback, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@tremor/react";
import { getFetchUrl } from "@/app/lib/getFetchUrl";
import { useAuthContext } from "@/app/context/AuthContext";
import { NO_MAX } from "@/app/Constants/filters";
import { Dialog, Transition } from "@headlessui/react";
import Link from "next/link";

export const ListingsPageContent = () => {
  const { authToken } = useAuthContext();
  const param = useSearchParams();
  const [search, setSearch] = useState(null);
  const [listingType, setListingType] = useState(undefined);
  const [locality, setLocality] = useState(param.get("locality") || "");
  let [savedSearchConfirmationModal, setSavedSearchConfirmationModal] =
    useState(false);
  let [savedSearchError, setSavedSearchError] = useState("");

  const onParamsChange = useCallback((data) => {
    setSearch(data);
  }, []);

  const handleSelectedLocalityChange = (locality: string) => {
    setLocality(locality);
  };

  const [showFiltersMobile, setShowFiltersMobile] = useState(true);

  // Create a proper saved search object from the filter values
  const getSavedSearchesBodyObjectFromFilters = (filterValues) => {
    return {
      priceMin: filterValues?.priceRange.min,
      priceMax:
        filterValues?.priceRange.max === NO_MAX
          ? undefined
          : filterValues?.priceRange.max,
      listedSince: filterValues?.listedSince,
      areaLivingMin: filterValues?.livingAreaRange.min,
      areaLivingMax:
        filterValues?.livingAreaRange.max === NO_MAX
          ? undefined
          : filterValues?.livingAreaRange.max,
      areaTotalMin: filterValues?.areaTotal.min,
      areaTotalMax:
        filterValues?.areaTotal.max === NO_MAX
          ? undefined
          : filterValues?.areaTotal.max,
      roomsMin: filterValues?.roomRange.min,
      roomsMax:
        filterValues?.roomRange.max === NO_MAX
          ? undefined
          : filterValues?.roomRange.max,
      bedroomsMin: filterValues?.bedroomRange.min,
      bedroomsMax:
        filterValues?.bedroomRange.max === NO_MAX
          ? undefined
          : filterValues?.bedroomRange.max,
      propertyType: filterValues?.propertyType,
      listingType: filterValues?.listingType,
      locality: locality || undefined,
    };
  };

  const handleSaveSearch = async () => {
    try {
      const response = await fetch(getFetchUrl(`/api/savedSearches`), {
        method: "POST",
        cache: "no-store",
        headers: {
          "Content-type": "application/json",
          Authorization: authToken,
        },
        body: JSON.stringify(getSavedSearchesBodyObjectFromFilters(search)),
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
    <div className="w-full flex flex-col my-8 lg:my-12 gap-6">
      <ListingsPageHeader
        onLocalityChange={handleSelectedLocalityChange}
        initialLocality={locality}
      />
      <div className="container flex justify-between">
        <Button
          className="lg:hidden"
          variant={"secondary"}
          onClick={() => setShowFiltersMobile(true)}
        >
          Filters
        </Button>
        <Button variant={"secondary"} onClick={handleSaveSearch}>
          Save search
        </Button>
      </div>
      <section className={"text-black pb-16 container"}>
        <div className="flex gap-10 justify-between lg:gap-24">
          <div
            className={`${
              !showFiltersMobile
                ? "hidden lg:block"
                : "fixed inset-0 bg-white z-10 pt-4 pb-24 overflow-y-scroll px-4 lg:min-w-min lg:block lg:static lg:p-0 lg:overflow-y-visible"
            }`}
          >
            <ListingsPageFilters
              onListingTypeChange={(e) => setListingType(e)}
              locality={locality}
              onParamsChange={onParamsChange}
              showFiltersMobile={() => setShowFiltersMobile(!showFiltersMobile)}
            />
          </div>
          <ListingsMain
            listingType={listingType}
            searchParams={search}
            locality={locality}
          />
        </div>
      </section>
      {/* Confirmation modal*/}
      <Transition appear show={savedSearchConfirmationModal} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setSavedSearchConfirmationModal(false)}
        >
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
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  {savedSearchError && (
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      Oops! Something went wrong. Please try again later.
                    </Dialog.Title>
                  )}
                  {!savedSearchError && (
                    <div>
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-medium leading-6 text-gray-900"
                      >
                        Your search has been saved! 🎉
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          You will be notified via email when new listings match
                          your search criteria.
                        </p>
                        <p className="text-sm text-gray-500">
                          You can manage your saved searches in your&nbsp;
                          <Link
                            href={"/profile"}
                            className={"text-blue-500 underline"}
                          >
                            profile
                          </Link>
                          .
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={() => setSavedSearchConfirmationModal(false)}
                    >
                      Got it!
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
