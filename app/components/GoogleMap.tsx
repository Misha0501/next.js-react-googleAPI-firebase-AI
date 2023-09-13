"use client";

import GoogleMapReact from "google-map-react";

interface GoogleMapProps {
  location: {
    address: string;
    lat: string | number;
    lng: string | number;
  };
}

const GoogleMap = ({ location }: GoogleMapProps) => {
  return (
    <div className="h-[300px] rounded-lg">
      <GoogleMapReact
        bootstrapURLKeys={{
          key: process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY || "",
        }}
        defaultCenter={location}
        defaultZoom={14}
      ></GoogleMapReact>
    </div>
  );
};

export default GoogleMap;
