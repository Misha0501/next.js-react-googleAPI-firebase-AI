"use client";

import { SavedListing } from "@/types";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import { HeartIcon } from "@heroicons/react/24/outline";
import { useMemo, useState } from "react";
import {
  useCreateSavedListing,
  useDeleteSavedListing,
  useSavedListings,
} from "@/providers/SavedListings";
import { useAuthContext } from "@/app/context/AuthContext";
import { toast } from "react-toastify";
import { Modal } from "@/app/components/shared/Modal";
import { useRouter } from "next/navigation";

type Prop = {
  listingId: number;
  showOnDesktop?: boolean;
};

export const ListingDetailSavedButton = ({
  listingId,
  showOnDesktop = false,
}: Prop) => {
  const { authToken } = useAuthContext();
  let [showAuthModal, setShowAuthModal] = useState(false);
  const savedListings = useSavedListings({ authToken });
  const createSavedListing = useCreateSavedListing({ authToken });
  const deleteSavedListing = useDeleteSavedListing({ authToken });

  const router = useRouter();

  const { isListingSaved, savedListing } = useMemo(() => {
    if (savedListings?.data?.results) {
      const savedListing = savedListings.data.results.find(
        (savedListing: SavedListing) => savedListing.listingId === listingId,
      );

      return {
        isListingSaved: !!savedListing,
        savedListing,
      };
    }

    return {
      isListingSaved: false,
      savedListing: null,
    };
  }, [savedListings?.data, listingId]);

  const savedIconIsLoading = useMemo(
    () =>
      savedListings.isLoading ||
      savedListings.isFetching ||
      createSavedListing.isLoading ||
      deleteSavedListing.isLoading,
    [
      savedListings.isLoading,
      savedListings.isFetching,
      createSavedListing.isLoading,
      deleteSavedListing.isLoading,
    ],
  );

  const handleSavedIconClick = async () => {
    // if user is not logged in show the auth modal
    if (!authToken) {
      setShowAuthModal(true);
      return;
    }

    try {
      if (!isListingSaved) {
        // if listings isn't saved do a post request to save it
        await createSavedListing.mutateAsync({
          listingId,
        });
      } else {
        // if it's saved do a delete request
        await deleteSavedListing.mutateAsync({ id: savedListing!.id });
      }
      await savedListings.refetch();
    } catch (error) {
      toast.error("Oops! Something went wrong. Please try again later.");
    }
  };
  return (
    <>
      {showOnDesktop && (
        <button
          disabled={savedIconIsLoading}
          className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-[#2D3648] shadow-sm transition hover:bg-slate-50 disabled:opacity-50 lg:flex"
          onClick={handleSavedIconClick}
          data-testid="favouriteButton"
        >
          {isListingSaved ? (
            <HeartIconSolid className="h-4 w-4 text-rose-500" />
          ) : (
            <HeartIcon className="h-4 w-4" />
          )}
          {savedIconIsLoading ? "Loading..." : "Favourite"}
        </button>
      )}

      {!showOnDesktop && (
        <div>
          {savedIconIsLoading ? (
            <div className="h-7 w-7 animate-spin rounded-full border-2 border-slate-200 border-t-[#1F5FD6]" />
          ) : (
            <button
              onClick={handleSavedIconClick}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-[#1F5FD6] shadow-sm transition hover:bg-slate-50"
            >
              {isListingSaved ? (
                <HeartIconSolid className="h-5 w-5 text-rose-500" />
              ) : (
                <HeartIcon className="h-5 w-5" />
              )}
            </button>
          )}
        </div>
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
