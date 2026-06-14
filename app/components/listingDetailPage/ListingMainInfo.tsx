import { Divider } from "@tremor/react";
import { Listing } from "@/types";
import {
  CalendarDaysIcon,
  ArrowsPointingOutIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";
import { BedRoomIcon } from "@/public/Icons";
import { formatToDayAndMonthWithName } from "@/app/lib/formatToDayAndMonthWithName";
import Link from "next/link";
import { ListingDetailSavedButton } from "@/app/components/listingDetailPage/ListingDetailSavedButton";
import {
  formatEuroPrice,
  formatEuroPricePerSquareMeter,
} from "@/app/lib/formatPrice";
import { roundNumberTwoDecimal } from "@/app/lib/roundNumberTwoDecimal";

type Prop = {
  listing: Listing;
};

export const ListingMainInfo = ({ listing }: Prop) => {
  const stats = [
    {
      title: "Rooms",
      value: listing?.rooms,
      icon: <Squares2X2Icon className="text-[#848484] h-6 w-6 shrink-0" />,
    },
    {
      title: "Bedrooms",
      value: listing?.bedrooms,
      icon: <BedRoomIcon />,
    },
    {
      title: "Square Area",
      value: listing?.areaTotal ? `${listing.areaTotal} m²` : null,
      icon: <ArrowsPointingOutIcon className="text-[#848484] h-6 w-6 shrink-0" />,
    },
    {
      title: "Offered since",
      value: formatToDayAndMonthWithName(listing?.createdAt ?? ""),
      icon: <CalendarDaysIcon className="text-[#848484] h-6 w-6 shrink-0" />,
    },
  ];

  if (!listing) return null;

  return (
    <>
      {/* Desktop stats bar */}
      <div className="bg-[#f2f2f2] rounded-lg shadow-md py-8 flex-col lg:flex-row items-center justify-between hidden lg:flex">
        {stats.map((el, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center w-full"
          >
            <p className="text-gray-500 text-sm">{el.title}</p>
            <div className="flex items-center pt-3">
              {el.icon}
              <p className="pl-2 text-gray-700 font-semibold">{el.value || "-"}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile layout */}
      <div className="block lg:hidden py-2">
        <div className="price_details flex justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold" data-testid={"price"}>
              {formatEuroPrice(listing?.price)}
              {listing?.price && listing?.areaTotal && (
                <small className="text-[#717D96] ml-2">
                  {formatEuroPricePerSquareMeter(
                    roundNumberTwoDecimal(listing.price / listing.areaTotal),
                  )}
                </small>
              )}
            </h2>
            <h3 className="text-[#717D96] text-xl font-bold mt-3">
              {listing?.Address[0]?.locality}
            </h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3 my-4">
              {stats.map((el, index) => (
                <div key={index} className="flex items-center gap-2">
                  {el.icon}
                  <div>
                    <p className="text-xs text-[#848484] leading-tight">{el.title}</p>
                    <p className="text-sm font-semibold text-gray-800 leading-tight">{el.value || "-"}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link href={`/users/${listing?.applicationUser?.id}`}>
              <p className="text-[#717D96] text-base">
                {listing?.company?.name
                  ? listing?.company?.name
                  : listing?.applicationUser?.displayName}
              </p>
            </Link>
          </div>
          <ListingDetailSavedButton
            listingId={listing?.id}
            showOnDesktop={false}
          />
        </div>
        <Divider className="mb-0 hidden lg:block" />
      </div>
    </>
  );
};
