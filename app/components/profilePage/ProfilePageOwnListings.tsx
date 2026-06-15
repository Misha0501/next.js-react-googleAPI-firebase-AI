"use client";

import { Listing } from "@/types";
import { ListingItem, ListingItemSkeleton } from "@/app/components/ListingItem";
import { useEffect, useState } from "react";
import { useAuthContext } from "@/app/context/AuthContext";
import { Modal } from "@/app/components/shared/Modal";
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

      <Modal
        show={deleteConfirmationModalOpen}
        onClose={closeModal}
        title="Are you sure you want to delete your property?"
        description="This action cannot be undone."
        onCancelClick={closeModal}
        confirmLabel="Yes, delete"
        onConfirm={deleteListing}
        confirmDanger
      />
    </>
  );
};
