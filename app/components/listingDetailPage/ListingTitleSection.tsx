import { Listing } from "@/types";

type Prop = {
  listing: Listing;
};

const capitalize = (s: string) =>
  s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";

export const ListingTitleSection = ({ listing }: Prop) => {
  if (!listing) return null;

  const parts = [
    listing?.propertyType ? capitalize(listing.propertyType) : null,
    listing?.rooms ? `${listing.rooms} rooms` : null,
    listing?.Address?.[0]?.locality ? `in ${capitalize(listing.Address[0].locality)}` : null,
    listing?.listingType ? `for ${capitalize(listing.listingType)}` : null,
  ].filter(Boolean);

  return (
    <div>
      <h1 className="font-semibold text-[#2D3648]">
        {parts.join(" ")}
      </h1>
      {listing?.Address?.[0]?.route && (
        <p className="pt-1 text-base text-[#717D96]">
          {listing.Address[0].route}
        </p>
      )}
    </div>
  );
};
