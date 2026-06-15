import { Listing } from "@/types";
import {
  CalendarDaysIcon,
  ArrowsPointingOutIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";
import { BedRoomIcon } from "@/app/components/ui/Icons";
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
      icon: <Squares2X2Icon className="h-5 w-5 shrink-0" />,
    },
    {
      title: "Bedrooms",
      value: listing?.bedrooms,
      icon: <BedRoomIcon />,
    },
    {
      title: "Square Area",
      value: listing?.areaTotal ? `${listing.areaTotal} m²` : null,
      icon: <ArrowsPointingOutIcon className="h-5 w-5 shrink-0" />,
    },
    {
      title: "Offered since",
      value: formatToDayAndMonthWithName(listing?.createdAt ?? ""),
      icon: <CalendarDaysIcon className="h-5 w-5 shrink-0" />,
    },
  ];

  if (!listing) return null;

  return (
    <>
      {/* Desktop stats bar */}
      <div className="hidden rounded-2xl border border-slate-200 bg-white px-2 py-3 shadow-sm lg:grid lg:grid-cols-4">
        {stats.map((el, index) => (
          <div
            key={index}
            className={`flex items-center gap-3 px-4 py-3 ${
              index === 0 ? "" : "border-l border-slate-200"
            }`}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EAF2FF] text-[#1F5FD6]">
              {el.icon}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase text-[#717D96]">
                {el.title}
              </p>
              <p className="mt-0.5 truncate font-semibold text-[#2D3648]">
                {el.value || "-"}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile layout */}
      <div className="block rounded-2xl border border-slate-200 bg-white px-4 py-5 shadow-sm lg:hidden">
        <div className="price_details flex justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold uppercase text-[#717D96]">
              Asking price
            </p>
            <h2
              className="mt-1 text-2xl font-bold text-[#2D3648]"
              data-testid={"price"}
            >
              {formatEuroPrice(listing?.price)}
              {listing?.price && listing?.areaTotal && (
                <small className="ml-2 text-sm font-semibold text-[#717D96]">
                  {formatEuroPricePerSquareMeter(
                    roundNumberTwoDecimal(listing.price / listing.areaTotal),
                  )}
                </small>
              )}
            </h2>
            <h3 className="mt-2 text-base font-semibold text-[#717D96]">
              {listing?.Address[0]?.locality}
            </h3>
            <div className="my-5 grid grid-cols-2 gap-x-4 gap-y-4 border-y border-slate-100 py-4">
              {stats.map((el, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#EAF2FF] text-[#1F5FD6]">
                    {el.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs leading-tight text-[#848484]">
                      {el.title}
                    </p>
                    <p className="truncate text-sm font-semibold leading-tight text-[#2D3648]">
                      {el.value || "-"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Link href={`/users/${listing?.applicationUser?.id}`}>
              <p className="text-sm font-medium text-[#717D96]">
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
      </div>
    </>
  );
};
