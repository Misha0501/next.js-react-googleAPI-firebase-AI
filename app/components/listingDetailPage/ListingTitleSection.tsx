import { Listing } from "@/types";

type Prop = {
  listing: Listing;
};

export const ListingTitleSection = ({ listing }: Prop) => {
  if (!listing) return null;

  return (
    <div className="">
      <h1 className="capitalize font-bold text-3xl">
        {listing?.propertyType}
        {listing?.rooms ? ` ${listing?.rooms} ROOMS` : ""}
        {listing?.Address?.[0]?.locality
          ? ` IN ${listing?.Address?.[0]?.locality?.toUpperCase()}`
          : null}
        {listing?.listingType ? ` FOR ${listing?.listingType}` : null}
      </h1>
      <p className="pt-2 lg:px-0 text-[18px] text-[#848484] mb-3">
        {listing?.Address?.[0]?.route}
      </p>
    </div>
  );
};
