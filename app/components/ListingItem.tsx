"use client";
import Image from "next/image";
import {
  HeartIcon as HeartIconSolid,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import {
  ArrowsPointingOutIcon,
  BuildingOffice2Icon,
  CalendarDaysIcon,
  FireIcon,
  HeartIcon as HeartIconOutline,
  HomeIcon,
  HomeModernIcon,
  MapIcon,
  MapPinIcon,
  PhotoIcon,
  SparklesIcon,
  Squares2X2Icon,
  TruckIcon,
  UserGroupIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";
import { Listing } from "@/types";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/app/context/AuthContext";
import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import {
  formatEuroPrice,
  formatEuroPricePerSquareMeter,
} from "@/app/lib/formatPrice";
import { roundNumberTwoDecimal } from "@/app/lib/roundNumberTwoDecimal";
import { Modal } from "@/app/components/shared/Modal";
import {
  useCreateSavedListing,
  useDeleteSavedListing,
} from "@/providers/SavedListings";
import { toast } from "react-toastify";

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

type ListingFeature = {
  key: string;
  label: string;
  icon: ReactNode;
};

const FEATURE_ICON_CLASS_NAME = "h-4 w-4 shrink-0";
const LISTING_IMAGE_PLACEHOLDER_SRC = "/imagePlaceholder.png";
const MAX_VISIBLE_FEATURES = 6;

const PROPERTY_TYPE_FEATURES: Record<
  Listing["propertyType"],
  { label: string; icon: ReactNode }
> = {
  APARTMENT: {
    label: "Apartment",
    icon: <BuildingOffice2Icon className={FEATURE_ICON_CLASS_NAME} />,
  },
  HOUSE: {
    label: "House",
    icon: <HomeModernIcon className={FEATURE_ICON_CLASS_NAME} />,
  },
  LAND: {
    label: "Land",
    icon: <MapIcon className={FEATURE_ICON_CLASS_NAME} />,
  },
  PARKING: {
    label: "Parking",
    icon: <TruckIcon className={FEATURE_ICON_CLASS_NAME} />,
  },
};

const INTERIOR_TYPE_LABELS: Record<Listing["interiorType"], string> = {
  FURNISHED: "Furnished",
  UNFURNISHED: "Unfurnished",
};

const HEATING_TYPE_LABELS: Record<Listing["heatingType"], string> = {
  BOILER: "Boiler heating",
  CENTRAL: "Central heating",
};

const UPKEEP_TYPE_LABELS: Record<Listing["upkeepType"], string> = {
  EXCELLENT: "Excellent upkeep",
  FAIR: "Fair upkeep",
  GOOD: "Good upkeep",
  POOR: "Needs upkeep",
};

const LISTING_TYPE_LABELS: Record<Listing["listingType"], string> = {
  RENT: "For rent",
  SELL: "For sale",
};

const getFiniteNumber = (value?: number | string | null) => {
  if (value === null || value === undefined || value === "") return null;

  const numericValue = Number(value);

  return Number.isFinite(numericValue) ? numericValue : null;
};

const getPositiveNumber = (value?: number | string | null) => {
  const numericValue = getFiniteNumber(value);

  return numericValue && numericValue > 0 ? numericValue : null;
};

const formatFeatureNumber = (value: number) => {
  const roundedValue = roundNumberTwoDecimal(value);

  return Number.isInteger(roundedValue)
    ? roundedValue.toString()
    : roundedValue.toFixed(2);
};

const pluralize = (value: number, singular: string, plural: string) => {
  return value === 1 ? singular : plural;
};

export const ListingItemSkeleton = () => {
  return (
    <div className="h-fit overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="h-[242px] w-full animate-pulse bg-slate-200" />
      <div className="flex min-h-[180px] justify-between gap-2 p-5">
        <div className="flex w-full flex-col">
          <div className="mb-4">
            <div className="mb-2 h-5 w-[180px] animate-pulse rounded bg-slate-200" />
            <div className="h-5 w-[130px] animate-pulse rounded bg-slate-200" />
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="h-[34px] w-[130px] animate-pulse rounded bg-slate-200" />
            <div className="h-[34px] w-[120px] animate-pulse rounded bg-slate-200" />
            <div className="h-[34px] w-[150px] animate-pulse rounded bg-slate-200" />
          </div>
        </div>
      </div>
    </div>
  );
};

const getConstructedYear = (
  value?: Listing["constructedYear"] | Date | number | null,
) => {
  if (!value) return null;

  if (typeof value === "number") {
    return value >= 1800 && value <= new Date().getFullYear() + 5
      ? value
      : null;
  }

  const date = new Date(value);
  const year = date.getFullYear();

  return Number.isFinite(date.getTime()) && year >= 1800 ? year : null;
};

const getFloorLabel = (listing: Listing) => {
  const floorNumber = getFiniteNumber(listing.floorNumber);
  const totalFloors = getPositiveNumber(listing.numberOfFloorsCommon);

  if (floorNumber === null) return null;

  const floorLabel =
    floorNumber === 0 ? "Ground floor" : `Floor ${floorNumber}`;

  return totalFloors ? `${floorLabel}/${totalFloors}` : floorLabel;
};

const getListingFeatures = (listing: Listing): ListingFeature[] => {
  const features: ListingFeature[] = [];
  const propertyTypeFeature = listing.propertyType
    ? PROPERTY_TYPE_FEATURES[listing.propertyType]
    : null;
  const areaTotal = getPositiveNumber(listing.areaTotal);
  const areaLiving = getPositiveNumber(listing.areaLiving);
  const areaLand = getPositiveNumber(listing.areaLand);
  const areaOutside = getPositiveNumber(listing.areaOutside);
  const areaGarage = getPositiveNumber(listing.areaGarage);
  const rooms = getPositiveNumber(listing.rooms);
  const bedrooms = getPositiveNumber(listing.bedrooms);
  const bathrooms = getPositiveNumber(listing.bathrooms);
  const parking = getPositiveNumber(listing.parking);
  const propertyFloors = getPositiveNumber(listing.numberOfFloorsProperty);
  const floorLabel = getFloorLabel(listing);
  const constructedYear = getConstructedYear(listing.constructedYear);

  if (propertyTypeFeature) {
    features.push({
      key: "property-type",
      ...propertyTypeFeature,
    });
  }

  if (areaTotal) {
    features.push({
      key: "area-total",
      label: `${formatFeatureNumber(areaTotal)} m² total`,
      icon: <ArrowsPointingOutIcon className={FEATURE_ICON_CLASS_NAME} />,
    });
  }

  if (areaLiving && areaLiving !== areaTotal) {
    features.push({
      key: "area-living",
      label: `${formatFeatureNumber(areaLiving)} m² living`,
      icon: <HomeIcon className={FEATURE_ICON_CLASS_NAME} />,
    });
  }

  if (areaLand) {
    features.push({
      key: "area-land",
      label: `${formatFeatureNumber(areaLand)} m² land`,
      icon: <MapIcon className={FEATURE_ICON_CLASS_NAME} />,
    });
  }

  if (rooms) {
    features.push({
      key: "rooms",
      label: `${rooms} ${pluralize(rooms, "room", "rooms")}`,
      icon: <Squares2X2Icon className={FEATURE_ICON_CLASS_NAME} />,
    });
  }

  if (bedrooms) {
    features.push({
      key: "bedrooms",
      label: `${bedrooms} ${pluralize(bedrooms, "bed", "beds")}`,
      icon: <UserGroupIcon className={FEATURE_ICON_CLASS_NAME} />,
    });
  }

  if (bathrooms) {
    features.push({
      key: "bathrooms",
      label: `${bathrooms} ${pluralize(bathrooms, "bath", "baths")}`,
      icon: <SparklesIcon className={FEATURE_ICON_CLASS_NAME} />,
    });
  }

  if (floorLabel) {
    features.push({
      key: "floor",
      label: floorLabel,
      icon: <BuildingOffice2Icon className={FEATURE_ICON_CLASS_NAME} />,
    });
  }

  if (propertyFloors && propertyFloors > 1) {
    features.push({
      key: "property-floors",
      label: `${propertyFloors} levels`,
      icon: <BuildingOffice2Icon className={FEATURE_ICON_CLASS_NAME} />,
    });
  }

  if (parking) {
    features.push({
      key: "parking",
      label: `${parking} ${pluralize(parking, "space", "spaces")}`,
      icon: <TruckIcon className={FEATURE_ICON_CLASS_NAME} />,
    });
  }

  if (areaGarage) {
    features.push({
      key: "garage",
      label: `${formatFeatureNumber(areaGarage)} m² garage`,
      icon: <TruckIcon className={FEATURE_ICON_CLASS_NAME} />,
    });
  }

  if (areaOutside) {
    features.push({
      key: "outside",
      label: `${formatFeatureNumber(areaOutside)} m² outside`,
      icon: <HomeModernIcon className={FEATURE_ICON_CLASS_NAME} />,
    });
  }

  if (constructedYear) {
    features.push({
      key: "constructed-year",
      label: `Built ${constructedYear}`,
      icon: <CalendarDaysIcon className={FEATURE_ICON_CLASS_NAME} />,
    });
  }

  if (listing.interiorType) {
    features.push({
      key: "interior",
      label: INTERIOR_TYPE_LABELS[listing.interiorType],
      icon: <HomeIcon className={FEATURE_ICON_CLASS_NAME} />,
    });
  }

  if (listing.heatingType) {
    features.push({
      key: "heating",
      label: HEATING_TYPE_LABELS[listing.heatingType],
      icon: <FireIcon className={FEATURE_ICON_CLASS_NAME} />,
    });
  }

  if (listing.upkeepType) {
    features.push({
      key: "upkeep",
      label: UPKEEP_TYPE_LABELS[listing.upkeepType],
      icon: <WrenchScrewdriverIcon className={FEATURE_ICON_CLASS_NAME} />,
    });
  }

  return features;
};

export const ListingItem = ({
  listingItemInitial,
  isLoadingSavedListings = false,
  ownerView = false,
  onDeleteIconClick,
  onStateChanged,
  isLoading,
  lazy = false,
}: ListingItemProps) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [listingItem, setListingItem] = useState(listingItemInitial);
  const [shouldRender, setShouldRender] = useState(!lazy);

  const { authToken } = useAuthContext();

  const router = useRouter();
  let [showAuthModal, setShowAuthModal] = useState(false);

  const createSavedListing = useCreateSavedListing({ authToken });
  const deleteSavedListing = useDeleteSavedListing({ authToken });

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

  const getLabel = () => {
    // convert string to date
    const date = new Date(listingItem.createdAt);
    // get the difference between the current date and the listing date
    const diffTime = Math.abs(new Date().getTime() - date.getTime());
    // get the difference in days
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    // if the difference is less than 7 days return new
    if (diffDays < 7) return "New";

    return null;
  };

  const onEditIconClick = () => {
    if (ownerView) {
      router.push(`/edit/${listingItem.id}`);
    }
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

  const handleSavedIconClick = async () => {
    // if user is not logged in show the auth modal
    if (!authToken) {
      setShowAuthModal(true);
      return;
    }

    try {
      if (!listingItem.savedListingId) {
        // if listings isn't saved do a post request to save it
        const savedListing = await createSavedListing.mutateAsync({
          listingId: listingItem.id,
        });
        setListingItem({ ...listingItem, savedListingId: savedListing.id });
      } else {
        // if it's saved do a delete request
        if (!listingItem.savedListingId) return;
        await deleteSavedListing.mutateAsync({
          id: listingItem.savedListingId,
        });

        setListingItem({ ...listingItem, savedListingId: undefined });
      }
    } catch (error) {
      toast.error("Oops! Something went wrong. Please try again later.");
    } finally {
      if (onStateChanged) {
        onStateChanged(listingItem);
      }
    }
  };
  const handleDeletedIconClick = () => {
    if (onDeleteIconClick) {
      onDeleteIconClick(listingItem);
    }
  };

  const listingFeatures = getListingFeatures(listingItem);
  const listingImageUrl = listingItem?.ListingImage?.find(
    (image) => image?.url,
  )?.url;
  const hasListingImage = Boolean(listingImageUrl);
  const listingImageSrc = listingImageUrl ?? LISTING_IMAGE_PLACEHOLDER_SRC;
  const imageCount =
    listingItem?.ListingImage?.filter((image) => Boolean(image?.url)).length ??
    0;
  const visibleFeatures = listingFeatures.slice(0, MAX_VISIBLE_FEATURES);
  const hiddenFeatureCount = listingFeatures.length - visibleFeatures.length;
  const listingTypeLabel = listingItem.listingType
    ? LISTING_TYPE_LABELS[listingItem.listingType]
    : null;
  const propertyTypeLabel = listingItem.propertyType
    ? PROPERTY_TYPE_FEATURES[listingItem.propertyType]?.label
    : null;
  const locality = listingItem?.Address?.[0]?.locality;
  const route = listingItem?.Address?.[0]?.route;
  const cardTitle = [
    propertyTypeLabel,
    listingItem?.rooms
      ? `${listingItem.rooms} ${pluralize(listingItem.rooms, "room", "rooms")}`
      : null,
  ]
    .filter(Boolean)
    .join(" ");
  const pricePerSquareMeter =
    listingItem?.areaTotal && listingItem?.price
      ? formatEuroPricePerSquareMeter(
          roundNumberTwoDecimal(listingItem.price / listingItem.areaTotal),
        )
      : null;

  if (!shouldRender) {
    return (
      <div ref={cardRef}>
        <ListingItemSkeleton />
      </div>
    );
  }

  return (
    <>
      <div
        ref={cardRef}
        role="link"
        tabIndex={0}
        onClick={goToListingPage}
        onKeyDown={handleCardKeyDown}
        className="group h-fit cursor-pointer animate-listing-card-enter overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-[#CFE0FF] hover:shadow-[0_20px_45px_rgba(15,23,42,0.12)] focus:outline-none focus:ring-2 focus:ring-[#1F5FD6]/30 focus:ring-offset-2"
      >
        {isLoading ? (
          <div className="h-[242px] w-full animate-pulse bg-slate-200" />
        ) : (
          <div className="image-wrapper relative h-[242px] w-full overflow-hidden bg-slate-100">
            <Image
              className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
              width={384}
              height={240}
              src={listingImageSrc}
              alt={
                hasListingImage
                  ? "Picture of the property"
                  : "No property image available"
              }
              sizes="(min-width: 1024px) 384px, (min-width: 640px) 50vw, 100vw"
              placeholder={"blur"}
              blurDataURL={
                "data:image/png;base64,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"
              }
            />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-950/45 to-transparent" />
            <div className="absolute left-4 right-4 top-4 z-10 flex items-start justify-between gap-3">
              <div className="flex flex-wrap gap-2">
                {getLabel() && (
                  <span className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold uppercase text-white shadow-sm">
                    {getLabel()}
                  </span>
                )}
                {listingTypeLabel && (
                  <span className="rounded-full border border-white/50 bg-white/90 px-3 py-1 text-xs font-semibold uppercase text-[#1F5FD6] shadow-sm backdrop-blur">
                    {listingTypeLabel}
                  </span>
                )}
                {imageCount > 0 && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-white/50 bg-white/90 px-3 py-1 text-xs font-semibold text-[#2D3648] shadow-sm backdrop-blur">
                    <PhotoIcon className="h-3.5 w-3.5 text-[#1F5FD6]" />
                    {imageCount}
                  </span>
                )}
              </div>
              {!ownerView &&
                !isLoadingSavedListings &&
                !createSavedListing.isLoading &&
                !deleteSavedListing.isLoading && (
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleSavedIconClick();
                    }}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/70 bg-white/95 text-[#1F5FD6] shadow-sm transition hover:bg-[#EAF2FF]"
                    aria-label={
                      listingItem?.savedListingId
                        ? "Remove saved property"
                        : "Save property"
                    }
                  >
                    {listingItem?.savedListingId ? (
                      <HeartIconSolid className="h-5 w-5" />
                    ) : (
                      <HeartIconOutline className="h-5 w-5" />
                    )}
                  </button>
                )}
              {(isLoadingSavedListings ||
                createSavedListing.isLoading ||
                deleteSavedListing.isLoading) &&
                !ownerView && (
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/70 bg-white/95 shadow-sm"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <div className="h-[18px] w-[18px] animate-spin rounded-full border-2 border-slate-200 border-t-[#1F5FD6]" />
                  </div>
                )}
            </div>
            {!hasListingImage && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-slate-950/5 text-slate-500">
                <PhotoIcon className="h-9 w-9" />
                <span className="rounded-md bg-white/85 px-3 py-1 text-sm font-semibold shadow-sm">
                  No image available
                </span>
              </div>
            )}
          </div>
        )}
        <div className="flex min-h-[190px] justify-between gap-3 p-5">
          <div className="flex w-full min-w-0 flex-col">
            <div className="mb-4">
              <div className="mb-2 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                {isLoading ? (
                  <div className="h-5 w-[170px] animate-pulse rounded bg-slate-200" />
                ) : (
                  <>
                    <span className="text-2xl font-semibold tracking-tight text-[#2D3648]">
                      {formatEuroPrice(listingItem?.price)}
                    </span>
                    {pricePerSquareMeter && (
                      <span className="rounded-full bg-[#EAF2FF] px-2.5 py-1 text-xs font-semibold text-[#1F5FD6]">
                        {pricePerSquareMeter}
                      </span>
                    )}
                  </>
                )}
              </div>
              {isLoading ? (
                <div className="h-5 w-[140px] animate-pulse rounded bg-slate-200" />
              ) : (
                <>
                  <p className="truncate text-base font-semibold text-[#2D3648]">
                    {cardTitle || propertyTypeLabel || "Property"}
                  </p>
                  {(locality || route) && (
                    <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-[#717D96]">
                      <MapPinIcon className="h-4 w-4 shrink-0 text-[#1F5FD6]" />
                      <span className="truncate">
                        {[route, locality].filter(Boolean).join(", ")}
                      </span>
                    </p>
                  )}
                </>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {isLoading ? (
                <div className="h-[34px] w-[260px] animate-pulse rounded bg-slate-200" />
              ) : (
                <>
                  {visibleFeatures.map((feature) => (
                    <div
                      key={feature.key}
                      title={feature.label}
                      className="flex max-w-full items-center gap-1.5 rounded-full border border-slate-200 bg-[#F8FAFC] px-3 py-1.5 text-[13px] font-semibold leading-5 text-[#4A5468]"
                    >
                      <span className="text-[#1F5FD6]">{feature.icon}</span>
                      <span className="whitespace-nowrap">{feature.label}</span>
                    </div>
                  ))}
                  {hiddenFeatureCount > 0 && (
                    <div className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[13px] font-semibold leading-5 text-[#717D96]">
                      +{hiddenFeatureCount} more
                    </div>
                  )}
                </>
              )}
            </div>
            {ownerView && (
              <div className="mt-5 grid grid-cols-2 gap-2 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 py-2 text-sm font-semibold text-[#2D3648] transition hover:border-[#CFE0FF] hover:bg-[#EAF2FF]"
                  onClick={(event) => {
                    event.stopPropagation();
                    onEditIconClick();
                  }}
                >
                  <PencilSquareIcon className="h-5 w-5 text-[#1F5FD6]" />
                  <span>Edit</span>
                </button>
                <button
                  type="button"
                  className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-rose-100 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-100"
                  onClick={(event) => {
                    event.stopPropagation();
                    handleDeletedIconClick();
                  }}
                >
                  <TrashIcon className="h-5 w-5" />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
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
