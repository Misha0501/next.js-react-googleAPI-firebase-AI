"use client";
import { useEffect, useRef } from "react";

interface GoogleMapProps {
  location: {
    address: string;
    lat: string | number;
    lng: string | number;
  };
}

const GoogleMap = ({ location }: GoogleMapProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lat = Number(location.lat);
    const lng = Number(location.lng);

    const initMap = () => {
      if (!containerRef.current || !(window as any).google?.maps) return;
      const { google } = window as any;
      const center = { lat, lng };
      const map = new google.maps.Map(containerRef.current, { center, zoom: 14 });
      new google.maps.Marker({ position: center, map });
    };

    if ((window as any).google?.maps) {
      initMap();
      return;
    }

    // Chain onto the existing Maps JS callback so we don't load the script twice.
    const prev = (window as any).initGoogleServices;
    (window as any).initGoogleServices = async (...args: unknown[]) => {
      if (prev) await prev(...args);
      initMap();
    };

    if (!document.querySelector('script[src*="maps.googleapis.com"]')) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY}&loading=async&callback=initGoogleServices`;
      document.body.appendChild(script);
    }
  }, [location.lat, location.lng]);

  return <div ref={containerRef} className="h-[300px] rounded-lg" />;
};

export default GoogleMap;
