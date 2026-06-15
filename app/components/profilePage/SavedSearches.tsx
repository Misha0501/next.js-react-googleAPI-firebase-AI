"use client";

import { Fragment, useMemo, useState } from "react";
import { useAuthContext } from "@/app/context/AuthContext";
import { SavedSearch } from "@/types";
import { Dialog, Transition } from "@headlessui/react";
import {
  useDeleteSavedSearch,
  useSavedSearches,
} from "@/providers/SavedSearaches";
import { toast } from "react-toastify";
import { CircularProgress } from "@mui/material";
import Link from "next/link";
import { formatEuroPriceRange } from "@/app/lib/formatPrice";
import {
  AdjustmentsHorizontalIcon,
  BellAlertIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

type SearchDetail = {
  label: string;
  value: string;
};

const formatRange = (
  min?: number | string | null,
  max?: number | string | null,
  suffix = "",
) => {
  if (!min && !max) return null;

  return `From ${min || "-"} to ${max || "-"}${suffix}`;
};

const formatDate = (value?: string | null) => {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const getSearchTitle = (item: SavedSearch) => item.locality || "Bulgaria";

const getSavedSearchHref = (item: SavedSearch) => {
  const params = new URLSearchParams();

  if (item.locality) params.set("locality", item.locality);
  if (item.priceMin) params.set("priceMin", String(item.priceMin));
  if (item.priceMax) params.set("priceMax", String(item.priceMax));
  if (item.listingType) params.set("listingType", item.listingType);
  if (item.propertyType?.length) {
    params.set("propertyType", JSON.stringify(item.propertyType));
  }
  if (item.areaTotalMin) params.set("areaTotalMin", String(item.areaTotalMin));
  if (item.areaTotalMax) params.set("areaTotalMax", String(item.areaTotalMax));
  if (item.areaLivingMin) {
    params.set("areaLivingMin", String(item.areaLivingMin));
  }
  if (item.areaLivingMax) {
    params.set("areaLivingMax", String(item.areaLivingMax));
  }
  if (item.roomsMin) params.set("roomsMin", String(item.roomsMin));
  if (item.roomsMax) params.set("roomsMax", String(item.roomsMax));
  if (item.bedroomsMin) params.set("bedroomsMin", String(item.bedroomsMin));
  if (item.bedroomsMax) params.set("bedroomsMax", String(item.bedroomsMax));

  const query = params.toString();

  return query ? `/listings?${query}` : "/listings";
};

const getSearchDetails = (item: SavedSearch): SearchDetail[] => {
  const details: SearchDetail[] = [];
  const totalArea = formatRange(item.areaTotalMin, item.areaTotalMax, " m²");
  const livingArea = formatRange(item.areaLivingMin, item.areaLivingMax, " m²");
  const rooms = formatRange(item.roomsMin, item.roomsMax);
  const bedrooms = formatRange(item.bedroomsMin, item.bedroomsMax);

  if (item.priceMin || item.priceMax) {
    details.push({
      label: "Price",
      value: formatEuroPriceRange(item.priceMin, item.priceMax),
    });
  }
  if (item.listingType) {
    details.push({
      label: "Offer type",
      value: item.listingType === "SELL" ? "Buy" : "Rent",
    });
  }
  if (item.propertyType?.length) {
    details.push({
      label: "Property types",
      value: item.propertyType.join(", "),
    });
  }
  if (totalArea) details.push({ label: "Total area", value: totalArea });
  if (livingArea) details.push({ label: "Living area", value: livingArea });
  if (rooms) details.push({ label: "Rooms", value: rooms });
  if (bedrooms) details.push({ label: "Bedrooms", value: bedrooms });
  details.push({ label: "Created", value: formatDate(item.createdAt) });

  return details;
};

export const SavedSearches = () => {
  const { authToken } = useAuthContext();
  const [deleteConfirmationModalOpen, setDeleteConfirmationModalOpen] =
    useState(false);
  const [searchToDelete, setSearchToDelete] = useState<SavedSearch | null>(
    null,
  );

  const {
    data: savedSearchesData,
    isLoading,
    refetch,
    error,
  } = useSavedSearches({ authToken });
  const deleteSavedSearch = useDeleteSavedSearch({ authToken });

  const savedSearches = useMemo(() => {
    if (!savedSearchesData) return [];
    return savedSearchesData.results;
  }, [savedSearchesData]);

  const savedSearchesTotal = savedSearchesData?.total ?? 0;

  function closeModal() {
    setDeleteConfirmationModalOpen(false);
  }

  const onDeleteClick = (item: SavedSearch) => {
    setDeleteConfirmationModalOpen(true);
    setSearchToDelete(item);
  };

  const confirmDelete = async () => {
    if (!searchToDelete?.id) return;

    const savedSearchId = searchToDelete.id;
    setSearchToDelete(null);
    closeModal();

    await deleteSavedSearch
      .mutateAsync({ id: savedSearchId })
      .catch((error) => {
        toast.error("Oops! Something went wrong. Please try again later.");
      });

    await refetch();

    toast.success("Your saved search has been deleted.");
  };

  return (
    <div className="w-full">
      {(deleteSavedSearch.isLoading || isLoading) && (
        <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
          <CircularProgress size={24} />
        </div>
      )}

      {error ? (
        <p className="rounded-2xl border border-rose-100 bg-rose-50 px-5 py-4 text-sm font-semibold text-rose-600">
          Oops there was an error
        </p>
      ) : null}

      {!isLoading && !error && (
        <div className="space-y-6">
          {savedSearchesTotal !== 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF2FF] text-[#1F5FD6]">
                  <BellAlertIcon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase text-[#717D96]">
                    Saved searches
                  </p>
                  <p className="font-semibold text-[#2D3648]">
                    {savedSearchesTotal}{" "}
                    {savedSearchesTotal === 1 ? "search" : "searches"} saved
                  </p>
                </div>
              </div>
            </div>
          )}

          {!savedSearchesTotal && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center shadow-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EAF2FF] text-[#1F5FD6]">
                <BellAlertIcon className="h-7 w-7" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-[#2D3648]">
                No saved searches yet
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#717D96]">
                Save search filters from the properties page and return to them
                here.
              </p>
              <Link
                href="/listings"
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-[#1F5FD6] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#184FB5]"
              >
                <MagnifyingGlassIcon className="h-4 w-4" />
                Browse properties
              </Link>
            </div>
          )}

          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            {savedSearches?.map((item) => {
              const details = getSearchDetails(item);

              return (
                <article
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                  key={item.id}
                >
                  <div className="border-b border-slate-100 px-5 py-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="flex items-center gap-1.5 text-sm font-semibold text-[#717D96]">
                          <MapPinIcon className="h-4 w-4 text-[#1F5FD6]" />
                          Search area
                        </p>
                        <h3 className="mt-2 truncate text-xl font-semibold text-[#2D3648]">
                          {getSearchTitle(item)}
                        </h3>
                      </div>
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EAF2FF] text-[#1F5FD6]">
                        <AdjustmentsHorizontalIcon className="h-5 w-5" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 px-5 py-5">
                    {details.map((detail) => (
                      <div
                        key={`${detail.label}-${detail.value}`}
                        className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3 last:border-b-0 last:pb-0"
                      >
                        <span className="text-sm text-[#717D96]">
                          {detail.label}
                        </span>
                        <span className="text-right text-sm font-semibold text-[#2D3648]">
                          {detail.value}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <Link
                      href={getSavedSearchHref(item)}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1F5FD6] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#184FB5]"
                    >
                      <MagnifyingGlassIcon className="h-4 w-4" />
                      View matches
                    </Link>
                    <button
                      type="button"
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-100 bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-600 transition hover:bg-rose-100"
                      onClick={() => onDeleteClick(item)}
                    >
                      <TrashIcon className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      )}

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
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-semibold leading-6 text-[#2D3648]"
                  >
                    Delete this saved search?
                  </Dialog.Title>
                  <p className="mt-2 text-sm text-[#717D96]">
                    You will stop seeing this search in your saved profile area.
                  </p>
                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-[#2D3648] hover:bg-slate-50"
                      onClick={closeModal}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-xl border border-transparent bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700"
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
