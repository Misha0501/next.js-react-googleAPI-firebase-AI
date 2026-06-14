"use client";

import { Address } from "@/types";
import GoogleMap from "@/app/components/GoogleMap";

type Prop = {
  address: Address;
};

export const MapsSection = ({ address }: Prop) => {
  if (!address?.latitude) return null;

  return (
    <section
      id="mapSection"
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
    >
      <div className="px-5 py-5 sm:px-6 lg:px-8">
        <p className="text-lg font-semibold text-[#2D3648] sm:text-xl">
          View on map
        </p>
        {address?.locality && (
          <p className="mt-1 text-sm text-[#717D96]">{address.locality}</p>
        )}
      </div>
      <div className="border-t border-slate-100 p-2">
        <GoogleMap
          data-testid={"map"}
          location={{
            lat: parseFloat(address?.latitude),
            lng: parseFloat(address?.longitude),
            address: address?.locality,
          }}
        />
      </div>
    </section>
  );
};
