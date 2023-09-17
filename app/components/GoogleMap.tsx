"use client";

import GoogleMapReact from "google-map-react";
import { MapPinIcon } from "@heroicons/react/24/solid";

interface GoogleMapProps {
  location: {
    address: string;
    lat: string | number;
    lng: string | number;
  };
}
const PointOnMap = () => <MapPinIcon className={'h-12 w-12 text-blue-700'}/>;
const GoogleMap = ({ location }: GoogleMapProps) => {
  return (
    <div className="h-[300px] rounded-lg">
      <GoogleMapReact
        bootstrapURLKeys={{
          key: process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY || "",
        }}
        defaultCenter={location}
        defaultZoom={14}
      >
        <PointOnMap
          lat={location.lat}
          lng={location.lng}
        />
      </GoogleMapReact>
    </div>
  );
};

export default GoogleMap;
