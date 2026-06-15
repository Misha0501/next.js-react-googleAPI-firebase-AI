"use client";

import { useRouter } from "next/navigation";
import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import type { Listing } from "@/types";
import {
  ListingItemCard,
  ListingItemSkeleton,
} from "@/app/components/listingItem/ListingItemCard";
import { ListingItemSaveButton } from "@/app/components/listingItem/ListingItemSaveButton";

export { ListingItemSkeleton } from "@/app/components/listingItem/ListingItemCard";

type ListingItemProps = {
  listingItemInitial: Listing;
  isLoadingSavedListings?: boolean;
  ownerView?: boolean;
  onEditIconClick?: (listingItem: Listing) => void;
  onDeleteIconClick?: (listingItem: Listing) => void;
  onStateChanged?: (listingItem: Listing) => void;
  isLoading?: boolean;
  lazy?: boolean;
};

export const ListingItem = ({
  listingItemInitial,
  isLoadingSavedListings = false,
  ownerView = false,
  onEditIconClick,
  onDeleteIconClick,
  onStateChanged,
  isLoading,
  lazy = false,
}: ListingItemProps) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [listingItem, setListingItem] = useState(listingItemInitial);
  const [shouldRender, setShouldRender] = useState(!lazy);
  const router = useRouter();

  const goToListingPage = () => {
    if (isLoading) return;

    router.push(`/listings/${listingItem.id}`);
  };

  const handleCardKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return;

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      goToListingPage();
    }
  };

  const handleEditIconClick = () => {
    if (onEditIconClick) {
      onEditIconClick(listingItem);
      return;
    }

    if (ownerView) {
      router.push(`/edit/${listingItem.id}`);
    }
  };

  const handleDeletedIconClick = () => {
    onDeleteIconClick?.(listingItem);
  };

  useEffect(() => {
    setListingItem(listingItemInitial);
  }, [listingItemInitial]);

  useEffect(() => {
    if (!lazy) {
      setShouldRender(true);
      return;
    }
    if (shouldRender) return;

    const cardElement = cardRef.current;
    if (!cardElement) return;
    if (!("IntersectionObserver" in window)) {
      setShouldRender(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldRender(true);
          observer.disconnect();
        }
      },
      { rootMargin: "500px 0px" },
    );

    observer.observe(cardElement);

    return () => observer.disconnect();
  }, [lazy, shouldRender]);

  if (!shouldRender) {
    return (
      <div ref={cardRef}>
        <ListingItemSkeleton />
      </div>
    );
  }

  return (
    <ListingItemCard
      ref={cardRef}
      listing={listingItem}
      isLoading={isLoading}
      ownerView={ownerView}
      onClick={goToListingPage}
      onKeyDown={handleCardKeyDown}
      onEditClick={handleEditIconClick}
      onDeleteClick={handleDeletedIconClick}
      saveControl={
        !ownerView ? (
          <ListingItemSaveButton
            listing={listingItem}
            isLoadingSavedListings={isLoadingSavedListings}
            onListingChange={setListingItem}
            onStateChanged={onStateChanged}
          />
        ) : null
      }
    />
  );
};
