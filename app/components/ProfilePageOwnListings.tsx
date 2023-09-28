"use client";

import { Listing } from "@/types";
import { ListingItem } from "@/app/components/ListingItem";
import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { getFetchUrl } from "@/app/lib/getFetchUrl";
import { useAuthContext } from "@/app/context/AuthContext";

type Props = {
  initialListings: Listing[];
};
export const ProfilePageOwnListings = ({ initialListings }: Props) => {
  const { authToken } = useAuthContext();

  const [listings, setListings] = useState(initialListings);
  let [deleteConfirmationModalOpen, setDeleteConfirmationModalOpen] =
    useState(false);
  const [listingToDelete, setListingToDelete] = useState<Listing | null>(null);

  function closeModal() {
    setDeleteConfirmationModalOpen(false);
  }

  const onDeletedIconClick = (listingItem: Listing) => {
    setListingToDelete(listingItem);
    setDeleteConfirmationModalOpen(true);
  };
  const deleteListing = () => {
    if (!listingToDelete) return;

    fetch(getFetchUrl(`/api/listings/${listingToDelete.id}`), {
      method: "DELETE",
      cache: "no-store",
      headers: {
        "Content-type": "application/json",
        Authorization: authToken,
      },
    })
      .then(() => {
        const filteredListings = listings.filter(
          (listing) => listing.id !== listingToDelete.id,
        );
        setListings(filteredListings);
        setListingToDelete(null);
        closeModal();
      })
      .catch((error) => {
        console.error(error.message);
        closeModal();
        setListingToDelete(null);
      });
  };

  return (
    <>
      <div className="grid grid-cols-3 gap-4">
        {listings &&
          listings.map((listing, index) => (
            <ListingItem
              key={index}
              listingItemInitial={listing}
              onDeleteIconClick={onDeletedIconClick}
              ownerView={true}
            ></ListingItem>
          ))}
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
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Are you sure you want to delete your property?
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
