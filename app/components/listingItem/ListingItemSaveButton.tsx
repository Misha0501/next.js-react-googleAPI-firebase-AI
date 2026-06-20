"use client";

import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import { HeartIcon as HeartIconOutline } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import type { Listing } from "@/types";
import { useAuthContext } from "@/app/context/AuthContext";
import { Modal } from "@/app/components/shared/Modal";
import {
  useCreateSavedListing,
  useDeleteSavedListing,
} from "@/providers/SavedListings";

type ListingItemSaveButtonProps = {
  listing: Listing;
  isLoadingSavedListings: boolean;
  onListingChange: (listing: Listing) => void;
  onStateChanged?: (listingItem: Listing) => void;
};

export const ListingItemSaveButton = ({
  listing,
  isLoadingSavedListings,
  onListingChange,
  onStateChanged,
}: ListingItemSaveButtonProps) => {
  const router = useRouter();
  const { isAuthenticated } = useAuthContext();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const createSavedListing = useCreateSavedListing();
  const deleteSavedListing = useDeleteSavedListing();
  const isSaving =
    isLoadingSavedListings ||
    createSavedListing.isPending ||
    deleteSavedListing.isPending;

  const handleSavedIconClick = async () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    let nextListing = listing;

    try {
      if (!listing.savedListingId) {
        const savedListing = await createSavedListing.mutateAsync({
          listingId: listing.id,
        });
        nextListing = { ...listing, savedListingId: savedListing.id };
      } else {
        await deleteSavedListing.mutateAsync({
          id: listing.savedListingId,
        });
        nextListing = { ...listing, savedListingId: undefined };
      }

      onListingChange(nextListing);
    } catch (error) {
      toast.error("Oops! Something went wrong. Please try again later.");
    } finally {
      onStateChanged?.(nextListing);
    }
  };

  return (
    <>
      {isSaving ? (
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/70 bg-white/95 shadow-sm"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="h-[18px] w-[18px] animate-spin rounded-full border-2 border-slate-200 border-t-[#1F5FD6]" />
        </div>
      ) : (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            handleSavedIconClick();
          }}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/70 bg-white/95 text-[#1F5FD6] shadow-sm transition hover:bg-[#EAF2FF]"
          aria-label={
            listing.savedListingId ? "Remove saved property" : "Save property"
          }
        >
          {listing.savedListingId ? (
            <HeartIconSolid className="h-5 w-5" />
          ) : (
            <HeartIconOutline className="h-5 w-5" />
          )}
        </button>
      )}
      <Modal
        title={"To save property please log in or create an account."}
        show={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onCancelClick={() => setShowAuthModal(false)}
        confirmLabel="Sign in / Sign up"
        onConfirm={() => router.push("/signin")}
      />
    </>
  );
};
