"use client";

import { Listing } from "@/types";
import { ListingItem, ListingItemSkeleton } from "@/app/components/ListingItem";
import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useAuthContext } from "@/app/context/AuthContext";
import { useDeleteListing } from "@/providers/Listing";
import { toast } from "react-toastify";
import Link from "next/link";
import { HomeModernIcon, PlusIcon } from "@heroicons/react/24/outline";

type Props = {
  initialListings: Listing[];
  isLoading?: boolean;
};
export const ProfilePageOwnListings = ({
  initialListings,
  isLoading,
}: Props) => {
  const { authToken } = useAuthContext();

  const [listings, setListings] = useState(initialListings);
  let [deleteConfirmationModalOpen, setDeleteConfirmationModalOpen] =
    useState(false);
  const [listingToDelete, setListingToDelete] = useState<Listing | null>(null);
  const deleteListingQuery = useDeleteListing({ authToken });

  useEffect(() => {
    setListings(initialListings);
  }, [initialListings]);

  function closeModal() {
    setDeleteConfirmationModalOpen(false);
  }

  const onDeletedIconClick = (listingItem: Listing) => {
    setListingToDelete(listingItem);
    setDeleteConfirmationModalOpen(true);
  };
  const deleteListing = () => {
    if (!listingToDelete) return;

    deleteListingQuery
      .mutateAsync({ id: listingToDelete.id })
      .catch((error) => {
        console.error(error.message);
        toast.error(error.message);
        closeModal();
        setListingToDelete(null);
      });

    // optimistic update
    const filteredListings = listings.filter(
      (listing) => listing.id !== listingToDelete.id,
    );
    setListings(filteredListings);
    setListingToDelete(null);
    closeModal();
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <ListingItemSkeleton key={i} />
            ))
          : listings.map((listing, index) => (
              <ListingItem
                key={index}
                listingItemInitial={listing}
                onDeleteIconClick={onDeletedIconClick}
                ownerView={true}
              />
            ))}
        {!isLoading && (!listings || !listings.length) && (
          <div className="col-span-full rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EAF2FF] text-[#1F5FD6]">
              <HomeModernIcon className="h-7 w-7" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-[#2D3648]">
              No properties yet
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#717D96]">
              Place your first property to start managing enquiries, edits, and
              saved activity from your profile.
            </p>
            <Link
              href="/placeproperties"
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-[#1F5FD6] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#184FB5]"
            >
              <PlusIcon className="h-4 w-4" />
              Place a property
            </Link>
          </div>
        )}
      </div>

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
                    Are you sure you want to delete your property?
                  </Dialog.Title>
                  <p className="mt-2 text-sm text-[#717D96]">
                    This action cannot be undone.
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
                      onClick={deleteListing}
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
    </>
  );
};
