"use client";
import { useEffect, useRef } from "react";

interface GoogleMapProps {
  location: {
    address: string;
    lat: string | number;
    lng: string | number;
  };
  "data-testid"?: string;
}

const GoogleMap = ({ location, "data-testid": dataTestId }: GoogleMapProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lat = Number(location.lat);
    const lng = Number(location.lng);
    const win = window as Window & { google?: typeof google; initGoogleServices?: (...args: unknown[]) => Promise<void> };

    const initMap = async () => {
      if (!containerRef.current || !win.google?.maps) return;
      const g = win.google;
      const center = { lat, lng };

      const map = new g.maps.Map(containerRef.current, {
        center,
        zoom: 14,
        mapId: "DEMO_MAP_ID",
      });

      // Use AdvancedMarkerElement if available, fall back to Marker
      try {
        const { AdvancedMarkerElement } =
          await g.maps.importLibrary("marker");
        new AdvancedMarkerElement({ position: center, map });
      } catch {
        new g.maps.Marker({ position: center, map });
      }
    };

    if (win.google?.maps) {
      initMap();
      return;
    }

    // Chain onto the existing Maps JS callback so we don't load the script twice.
    const prev = win.initGoogleServices;
    win.initGoogleServices = async (...args: unknown[]) => {
      if (prev) await prev(...args);
      await initMap();
    };

    if (!document.querySelector('script[src*="maps.googleapis.com"]')) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY}&loading=async&callback=initGoogleServices`;
      document.body.appendChild(script);
    }
  }, [location.lat, location.lng]);

  return (
    <div
      ref={containerRef}
      data-testid={dataTestId}
      className="h-[320px] rounded-lg"
    />
  );
};

export default GoogleMap;
