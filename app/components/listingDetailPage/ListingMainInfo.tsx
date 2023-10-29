import { Divider } from "@tremor/react";
import { Listing } from "@/types";
import { ClockIcon, Square3Stack3DIcon } from "@heroicons/react/24/outline";
import { Icons, BedRoomIcon, WindowsIcon } from "@/public/Icons";
import { GridIcon } from "@/public/GridIcon";
import { formatToDayAndMonthWithName } from "@/app/lib/formatToDayAndMonthWithName";
import Link from "next/link";
import { ListingDetailSavedButton } from "@/app/components/listingDetailPage/ListingDetailSavedButton";

type Prop = {
  listing: Listing;
};

export const ListingMainInfo = ({ listing }: Prop) => {
  let stats = [
    {
      title: "Rooms",
      value: listing?.rooms,
      icon: <Square3Stack3DIcon className="text-[#848484] h-7 w-7" />,
    },
    {
      title: "Bedrooms",
      value: listing?.bedrooms,
      icon: <Icons />,
    },
    {
      title: "Square Area",
      value: listing?.areaTotal,
      icon: <GridIcon />,
    },
    {
      title: "Offered since",
      value: formatToDayAndMonthWithName(listing?.createdAt ?? ""),
      icon: <ClockIcon className="text-[#848484] h-7 w-7" />,
    },
  ];

  if (!listing) return null;

  return (
    <>
      <div className="bg-[#f2f2f2] rounded-lg shadow-md  py-8  flex-col lg:flex-row items-center justify-between hidden lg:flex">
        {stats?.map((el, index) => (
          <div
            key={index}
            className="flex flex-row lg:flex-col items-center justify-between w-full sm:border-1"
          >
            <p className="text-gray-600">{el.title}</p>
            <div className="flex items-center pt-2 sm:pt-4">
              {el.icon}
              <p className="pl-2 text-gray-600">{el.value || "-"}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="block lg:hidden py-2">
        <div className="price_details flex justify-between">
          <div>
            <h2 className="text-2xl font-bold" data-testid={"price"}>
              €{listing?.price}{" "}
              <small className="text-[#717D96] ml-2">
                {listing?.areaTotal}/m2
              </small>
            </h2>
            <h3 className="text-[#717D96] text-xl font-bold mt-3">
              {listing?.Address[0]?.locality}
            </h3>
            <div className="flex my-3">
              <div className="flex items-center mr-3">
                <WindowsIcon />
                <p className="ml-2 text-[#717D96] text-base">
                  {listing?.areaTotal} m2
                </p>
              </div>
              <div className="flex items-center">
                <BedRoomIcon />
                <p className="ml-2 text-[#717D96] text-base">
                  {listing?.bedrooms} bedrooms
                </p>
              </div>
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
