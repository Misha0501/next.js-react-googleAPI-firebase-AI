import { Listing, SavedListing } from "@/types";
import { Button } from "@tremor/react";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import { HeartIcon } from "@heroicons/react/24/outline";
import { useMemo, useState } from "react";
import { useCreateSavedListing, useDeleteSavedListing, useSavedListings } from "@/providers/SavedListings";
import { useAuthContext } from "@/app/context/AuthContext";
import { toast } from "react-toastify";
import { Modal } from "@/app/components/Modal";
import { useRouter } from "next/navigation";

type Prop = {
  listingId: number;
};

export const ListingDetailSavedButton = ({ listingId }: Prop) => {
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
        await deleteSavedListing.mutateAsync({ id: savedListing.id });
      }
      await savedListings.refetch();
    } catch (error) {
      toast.error("Oops! Something went wrong. Please try again later.");
    }
  };
  return (
    <>
      <Button
        icon={isListingSaved ? HeartIconSolid : HeartIcon}
        variant={"secondary"}
        loading={savedIconIsLoading}
        className={"hidden lg:flex"}
        onClick={handleSavedIconClick}
        data-testid="favouriteButton"
      >
        Favourite
      </Button>

      <Modal
        title={"To save property please log in or create an account."}
        show={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onCancelClick={() => setShowAuthModal(false)}
        onSubmitClick={() => router.push("/signin")}
      />
    </>

  );
};
