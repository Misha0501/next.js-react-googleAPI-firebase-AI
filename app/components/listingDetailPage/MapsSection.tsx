"use client";

import { Address } from "@/types";
import GoogleMap from "@/app/components/GoogleMap";

type Prop = {
  address: Address;
};

export const MapsSection = ({ address }: Prop) => {
  if (!address?.latitude) return null;

  return (
    <div id="mapSection" className={"py-8"}>
      <p className="text-2xl pb-8">View on map</p>
      <GoogleMap
        data-testid={"map"}
        location={{
          lat: parseFloat(address?.latitude),
          lng: parseFloat(address?.longitude),
          address: address?.locality,
        }}
      />
    </div>
  );
};
