"use client";
import { ListingsMain } from "@/app/components/listingsPage/ListingsMain";
import { ListingsPageHeader } from "@/app/components/listingsPage/ListingsPageHeader";
import { ListingsPageFilters } from "@/app/components/listingsPage/ListingsPageFilters";
import { Fragment, useCallback, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@tremor/react";
import { useAuthContext } from "@/app/context/AuthContext";
import { NO_MAX } from "@/app/lib/constants/filters";
import { Dialog, Transition } from "@headlessui/react";
import Link from "next/link";
import { useCreateSavedSearches } from "@/providers/SavedSearaches";
import { toast } from "react-toastify";
import { Modal } from "@/app/components/Modal";
import { ListingType } from "@/types";

export const ListingsPageContent = () => {
  const { authToken } = useAuthContext();
  const param = useSearchParams();
  const [search, setSearch] = useState(null);
  const [listingType, setListingType] = useState<ListingType>("SELL");
  const [locality, setLocality] = useState(param.get("locality") || "");
  const createSavedSearches = useCreateSavedSearches({ authToken });
  let [showAuthModal, setShowAuthModal] = useState(false);

  let [savedSearchConfirmationModal, setSavedSearchConfirmationModal] =
    useState(false);
  let [savedSearchError, setSavedSearchError] = useState("");
  const router = useRouter();

  const onParamsChange = useCallback((data: any) => {
    setSearch(data);
  }, []);

  const handleSelectedLocalityChange = (newLocality: string) => {
    setLocality(newLocality);
    const params = new URLSearchParams(param.toString());
    if (newLocality) {
      params.set("locality", newLocality);
    } else {
      params.delete("locality");
    }
    params.delete("page");
    router.replace(`/listings?${params.toString()}`);
  };

  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  // Create a proper saved search object from the filter values
  const getSavedSearchesBodyObjectFromFilters = (filterValues: any) => {
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
    // If the user is not logged in, show the login modal
    if (!authToken) {
      setShowAuthModal(true);
      return;
    }

    try {
      await createSavedSearches.mutateAsync(
        getSavedSearchesBodyObjectFromFilters(search),
      );
      setSavedSearchConfirmationModal(true);
      toast.success("Your search has been saved!");
    } catch (e) {
      console.error("error");
      toast.error("Oops! Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#F8FAFC]">
      <ListingsPageHeader
        onLocalityChange={handleSelectedLocalityChange}
        initialLocality={locality}
      />
      <div className="mx-auto flex w-full max-w-screen-xl items-center justify-between gap-3 px-4 pt-6 sm:px-6 lg:px-8">
        <Button
          className="lg:hidden border-slate-200 bg-white text-[#2D3648] shadow-sm hover:bg-slate-50"
          variant={"secondary"}
          onClick={() => setShowFiltersMobile(true)}
        >
          Filters
        </Button>
        <Button
          variant={"secondary"}
          className="border-slate-200 bg-white text-[#2D3648] shadow-sm hover:bg-slate-50"
          onClick={handleSaveSearch}
          disabled={createSavedSearches.isLoading}
        >
          {createSavedSearches.isLoading ? "Saving..." : "Save search"}
        </Button>
      </div>
      <section className="mx-auto w-full max-w-screen-xl px-4 pb-20 pt-6 text-black sm:px-6 lg:px-8">
        <div className="flex items-start justify-between gap-6 lg:gap-8 xl:gap-10">
          <div
            className={`${
              !showFiltersMobile
                ? "hidden lg:block lg:w-[320px] lg:shrink-0 xl:w-[340px]"
                : "fixed inset-0 z-[70] overflow-y-auto bg-[#F8FAFC] px-4 pb-24 pt-4 lg:static lg:block lg:w-[320px] lg:shrink-0 lg:overflow-visible lg:bg-transparent lg:p-0 xl:w-[340px]"
            }`}
          >
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-28">
              <ListingsPageFilters
                onListingTypeChange={(e) => setListingType(e)}
                locality={locality}
                onParamsChange={onParamsChange}
                showFiltersMobile={() =>
                  setShowFiltersMobile(!showFiltersMobile)
                }
              />
            </div>
          </div>
          <ListingsMain
            listingType={listingType}
            searchParams={search}
            locality={locality}
          />
        </div>
      </section>
      <Modal
        title={"To save the search please log in or create an account."}
        show={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onCancelClick={() => setShowAuthModal(false)}
        onSubmitClick={() => router.push("/signin")}
      />
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
                      className="inline-flex justify-center rounded-md border border-transparent bg-tremor-brand px-4 py-2 text-sm font-medium text-tremor-brand-inverted hover:bg-tremor-brand-emphasis focus:outline-none focus-visible:ring-2 focus-visible:ring-tremor-brand focus-visible:ring-offset-2"
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
