"use client";
import { ListingsMain } from "@/app/components/listingsPage/ListingsMain";
import { ListingsPageHeader } from "@/app/components/listingsPage/ListingsPageHeader";
import { ListingsPageFilters } from "@/app/components/listingsPage/ListingsPageFilters";
import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthContext } from "@/app/context/AuthContext";
import { NO_MAX } from "@/app/lib/constants/filters";
import Link from "next/link";
import { useCreateSavedSearches } from "@/providers/SavedSearches";
import { toast } from "react-toastify";
import { Modal } from "@/app/components/shared/Modal";
import { ListingType } from "@/types";
import {
  getFilterValuesFromSearchParams,
  type FilterValues,
} from "@/app/components/listingsPage/Filters";

const getListingTypeFromSearchParams = (
  params: Pick<URLSearchParams, "get">,
): ListingType => {
  return params.get("listingType") === "RENT" ? "RENT" : "SELL";
};

export const ListingsPageContent = () => {
  const { authToken } = useAuthContext();
  const param = useSearchParams();
  const queryString = param.toString();
  const listingType = getListingTypeFromSearchParams(param);
  const locality = param.get("locality") || "";
  const search = useMemo(
    () =>
      getFilterValuesFromSearchParams(
        new URLSearchParams(queryString),
        listingType,
      ),
    [listingType, queryString],
  );
  const createSavedSearches = useCreateSavedSearches({ authToken });
  let [showAuthModal, setShowAuthModal] = useState(false);

  let [savedSearchConfirmationModal, setSavedSearchConfirmationModal] =
    useState(false);
  let [savedSearchError, setSavedSearchError] = useState("");
  const router = useRouter();

  const handleSelectedLocalityChange = (newLocality: string) => {
    const params = new URLSearchParams(queryString);
    if (newLocality) {
      params.set("locality", newLocality);
    } else {
      params.delete("locality");
    }
    params.delete("page");
    const nextQueryString = params.toString();
    window.history.replaceState(
      null,
      "",
      nextQueryString ? `/listings?${nextQueryString}` : "/listings",
    );
  };

  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  // Create a proper saved search object from the filter values
  const getSavedSearchesBodyObjectFromFilters = (
    filterValues: FilterValues,
  ) => {
    return {
      priceMin: filterValues.priceRange.min,
      priceMax:
        filterValues.priceRange.max === NO_MAX
          ? undefined
          : filterValues.priceRange.max,
      listedSince: filterValues.listedSince,
      areaLivingMin: filterValues.livingAreaRange.min,
      areaLivingMax:
        filterValues.livingAreaRange.max === NO_MAX
          ? undefined
          : filterValues.livingAreaRange.max,
      areaTotalMin: filterValues.areaTotal.min,
      areaTotalMax:
        filterValues.areaTotal.max === NO_MAX
          ? undefined
          : filterValues.areaTotal.max,
      roomsMin: filterValues.roomRange.min,
      roomsMax:
        filterValues.roomRange.max === NO_MAX
          ? undefined
          : filterValues.roomRange.max,
      bedroomsMin: filterValues.bedroomRange.min,
      bedroomsMax:
        filterValues.bedroomRange.max === NO_MAX
          ? undefined
          : filterValues.bedroomRange.max,
      propertyType: filterValues.propertyType,
      listingType: filterValues.listingType,
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
        <button
          type="button"
          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-[#2D3648] shadow-sm hover:bg-slate-50 lg:hidden"
          onClick={() => setShowFiltersMobile(true)}
        >
          Filters
        </button>
        <button
          type="button"
          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-[#2D3648] shadow-sm hover:bg-slate-50 disabled:opacity-50"
          onClick={handleSaveSearch}
          disabled={createSavedSearches.isLoading}
        >
          {createSavedSearches.isLoading ? "Saving..." : "Save search"}
        </button>
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
            <div className="lg:sticky lg:top-28">
              <ListingsPageFilters
                listingType={listingType}
                locality={locality}
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
        confirmLabel="Sign in / Sign up"
        onConfirm={() => router.push("/signin")}
      />
      <Modal
        show={savedSearchConfirmationModal}
        onClose={() => setSavedSearchConfirmationModal(false)}
        title={
          savedSearchError
            ? "Oops! Something went wrong. Please try again later."
            : "Your search has been saved! 🎉"
        }
        description={
          savedSearchError
            ? undefined
            : "You will be notified via email when new properties match your search criteria."
        }
        confirmLabel="Got it!"
        onConfirm={() => setSavedSearchConfirmationModal(false)}
      >
        {!savedSearchError && (
          <p className="text-sm text-[#717D96]">
            You can manage your saved searches in your{" "}
            <Link href="/profile" className="text-[#1F5FD6] underline">
              profile
            </Link>
            .
          </p>
        )}
      </Modal>
    </div>
  );
};
