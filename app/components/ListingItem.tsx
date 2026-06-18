"use client";

import { useRouter } from "next/navigation";
import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
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
  ownerAction?: {
    label: string;
    icon: ReactNode;
    disabled?: boolean;
    onClick: (listingItem: Listing) => void;
  };
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
  ownerAction,
  onStateChanged,
  isLoading,
  lazy = false,
}: ListingItemProps) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const listingItemVersion = `${listingItemInitial.id}:${listingItemInitial.updatedAt}:${listingItemInitial.savedListingId ?? ""}`;
  const [listingItemState, setListingItemState] = useState(() => ({
    version: listingItemVersion,
    value: listingItemInitial,
  }));
  const [shouldRender, setShouldRender] = useState(!lazy);
  const router = useRouter();
  const listingItem =
    listingItemState.version === listingItemVersion
      ? listingItemState.value
      : listingItemInitial;
  const shouldRenderCard = shouldRender || !lazy;

  const handleListingChange = (nextListingItem: Listing) => {
    setListingItemState({
      version: listingItemVersion,
      value: nextListingItem,
    });
  };

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

  const handleOwnerActionClick = () => {
    ownerAction?.onClick(listingItem);
  };

  useEffect(() => {
    if (shouldRenderCard) return;

    const cardElement = cardRef.current;
    if (!cardElement) return;
    if (!("IntersectionObserver" in window)) {
      const timeoutId = setTimeout(() => setShouldRender(true), 0);
      return () => clearTimeout(timeoutId);
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
  }, [shouldRenderCard]);

  if (!shouldRenderCard) {
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
      ownerAction={
        ownerAction
          ? {
              label: ownerAction.label,
              icon: ownerAction.icon,
              disabled: ownerAction.disabled,
              onClick: handleOwnerActionClick,
            }
          : undefined
      }
      saveControl={
        !ownerView ? (
          <ListingItemSaveButton
            listing={listingItem}
            isLoadingSavedListings={isLoadingSavedListings}
            onListingChange={handleListingChange}
            onStateChanged={onStateChanged}
          />
        ) : null
      }
    />
  );
};
