"use client";

import { Company, Listing } from "@/types";
import { ListingItem, ListingItemSkeleton } from "@/app/components/ListingItem";
import { useMemo, useState } from "react";
import { useAuthContext } from "@/app/context/AuthContext";
import { Modal } from "@/app/components/shared/Modal";
import { useDeleteListing, useUpdateProperty } from "@/providers/Listing";
import { Pagination } from "@/app/components/shared/Pagination";
import { toast } from "react-toastify";
import Link from "next/link";
import {
  BuildingOffice2Icon,
  HomeModernIcon,
  PlusIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

const PAGE_SIZE = 12;

type Props = {
  initialListings: Listing[];
  isLoading?: boolean;
  company?: Pick<Company, "id" | "name"> | null;
  canMoveOwnership?: boolean;
};
export const ProfilePageOwnListings = ({
  initialListings,
  isLoading,
  company,
  canMoveOwnership = false,
}: Props) => {
  const { authToken } = useAuthContext();

  const [deletedListingIds, setDeletedListingIds] = useState<number[]>([]);
  const [updatedListings, setUpdatedListings] = useState<
    Record<number, Listing>
  >({});
  const [page, setPage] = useState(1);
  const [deleteConfirmationModalOpen, setDeleteConfirmationModalOpen] =
    useState(false);
  const [listingToDelete, setListingToDelete] = useState<Listing | null>(null);
  const [movingListingId, setMovingListingId] = useState<number | null>(null);
  const deleteListingQuery = useDeleteListing({ authToken });
  const updateProperty = useUpdateProperty({ authToken });

  const listings = useMemo(
    () =>
      initialListings
        .filter((listing) => !deletedListingIds.includes(listing.id))
        .map((listing) => updatedListings[listing.id] ?? listing),
    [deletedListingIds, initialListings, updatedListings],
  );

  const totalPages = Math.ceil(listings.length / PAGE_SIZE);
  const currentPage = Math.min(page, Math.max(totalPages, 1));
  const pagedListings = useMemo(
    () =>
      listings.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [currentPage, listings],
  );

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
    setDeletedListingIds((currentIds) => [...currentIds, listingToDelete.id]);
    setListingToDelete(null);
    closeModal();
  };
  const moveListingOwnership = async (listing: Listing) => {
    if (!company) return;

    const moveToCompany = !listing.companyId;
    const nextCompanyId = moveToCompany ? company.id : null;

    setMovingListingId(listing.id);

    try {
      const updatedListing = await updateProperty.mutateAsync({
        id: listing.id,
        companyId: nextCompanyId,
      });

      setUpdatedListings((currentListings) => ({
        ...currentListings,
        [listing.id]: updatedListing,
      }));
      toast.success(
        moveToCompany
          ? `Property moved to ${company.name}`
          : "Property moved to personal listings",
      );
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Error updating property",
      );
    } finally {
      setMovingListingId(null);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <ListingItemSkeleton key={i} />
            ))
          : pagedListings.map((listing) => (
              <ListingItem
                key={listing.id}
                listingItemInitial={listing}
                onDeleteIconClick={onDeletedIconClick}
                ownerAction={
                  canMoveOwnership && company
                    ? {
                        label: listing.companyId
                          ? "Move to personal"
                          : "Move to company",
                        icon: listing.companyId ? (
                          <UserCircleIcon className="h-5 w-5 text-[#1F5FD6]" />
                        ) : (
                          <BuildingOffice2Icon className="h-5 w-5 text-[#1F5FD6]" />
                        ),
                        disabled: movingListingId === listing.id,
                        onClick: moveListingOwnership,
                      }
                    : undefined
                }
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

      {totalPages > 1 && (
        <div className="mt-6">
          <Pagination
            page={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      )}

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
