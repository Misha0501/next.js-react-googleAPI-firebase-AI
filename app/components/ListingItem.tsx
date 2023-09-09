"use client";
import headerImg from "@/public/header-hero.jpg";
import Image from "next/image";
import { HeartIcon as HeartIconSolid, PencilSquareIcon, TrashIcon } from "@heroicons/react/24/solid";
import { HeartIcon as HeartIconOutline } from "@heroicons/react/24/outline";
import { CurrencyType, Listing } from "@/types";
import { useRouter } from "next/navigation";

type ListingItemProps = {
  listingItem: Listing
  onSavedIconClick: (listingItem: Listing) => void
  isLoadingSavedListings: boolean
  ownerView: boolean
  onEditIconClick: (listingItem: Listing) => void
  onDeleteIconClick: (listingItem: Listing) => void
}

export const ListingItem = ({ listingItem, onSavedIconClick, isLoadingSavedListings = false, ownerView, onDeleteIconClick }: ListingItemProps) => {

  const router = useRouter();
  var moneyFormatter = new Intl.NumberFormat();


  const goToListingPage = () => {
    router.push(`/listings/${listingItem.id}`);
  };

  const getLabel = () => {
    return "New";
  };

  const handleSavedIconClick = () => {
    if (onSavedIconClick) {
      onSavedIconClick(listingItem);
    }
  };
  const onEditIconClick = () => {
    if (ownerView) {
      router.push(`/editListing/${listingItem.id}`);
    }
  }

  const handleDeletedIconClick = () => {
    if (onDeleteIconClick) {
      onDeleteIconClick(listingItem);
    }
  }


  const roundToTwo = (num: number) => {
    return +(Math.round(num + "e+2") + "e-2");
  };

  const getCurrencySign = (currency: CurrencyType) => {
    switch (currency) {
      case "EUR":
        return "€";
      case "USD":
        return "$";
      case "BGN":
        return "лв.";
      default:
        return "";
    }
  };

  return (
    <div className={"rounded-lg drop-shadow-2xl bg-white h-fit"}>
      <div className="image-wrapper relative cursor-pointer" onClick={goToListingPage}>
        {getLabel() && <div
          className="px-6 py-1 absolute top-4 left-4 bg-green-500 rounded-lg text-white">{getLabel()}</div>}
        <Image
          className={"h-full rounded-t-lg w-full object-cover"}
          width={384}
          height={240}
          src={headerImg}
          alt="Picture of the property"
          placeholder="blur" // Optional blur-up while loading
        />
      </div>
      <div className="flex justify-between p-4 gap-2">
        <div className="flex flex-col w-full">
          <div className="mb-4 cursor-pointer" onClick={goToListingPage}>
            <div className="flex mb-1 items-baseline space-x-2">
              <span
                className={"font-bold text-[#0071b3] text-xl"}>{getCurrencySign(listingItem.currency)}{moneyFormatter.format(listingItem.price)}</span>
              {listingItem.areaTotal && listingItem.price && listingItem.currency && <span
                className={"text-gray-500 font-semibold"}>{roundToTwo(listingItem.price / listingItem.areaTotal)} {getCurrencySign(listingItem.currency)} / &#13217;</span>}
            </div>
            <span className={"font-bold text-gray-500"}>Sofia, Center</span>
          </div>
          <div className="icons-row">
            <div className="flex items-center gap-2 mb-4">
              <HeartIconSolid className={"h-6 w-6 text-gray-500"}></HeartIconSolid>
              <span className={"text-gray-500"}>{listingItem.areaLiving} m2</span>
            </div>
          </div>
          {ownerView &&
            <div className={"flex flex-col gap-2"}>
              <div className={"flex items-center gap-2 cursor-pointer"}
                   onClick={onEditIconClick}
              >
                <PencilSquareIcon className={"h-8 w-8 text-gray-500"} />
                <span>Edit</span>
              </div>
              <div className={"flex items-center gap-2  text-red-600 cursor-pointer"}
                   onClick={handleDeletedIconClick}>
                <TrashIcon className={"h-8 w-8"} />
                <span>Delete</span>
              </div>
            </div>
          }
        </div>
        {isLoadingSavedListings && "loading"}

        {!ownerView && !isLoadingSavedListings && <div onClick={handleSavedIconClick} className={"cursor-pointer"}>
          {listingItem.savedListingId && <HeartIconSolid className={"h-8 w-8 text-gray-500"} />}
          {!listingItem.savedListingId && <HeartIconOutline className={"h-8 w-8 text-gray-500"} />}
        </div>}
      </div>
    </div>
  );
};
