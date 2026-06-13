import { useEffect, useState } from 'react';
import { loadJS } from "@/app/lib/loadJS";

let googleInstance: any;

export const useGooglePlaces = (): [any | undefined, boolean, string | null] => {
  const [google, setGoogle] = useState<any>(googleInstance);
  const [loading, setLoading] = useState(!googleInstance);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (googleInstance) return;

    if ((window as any).google?.maps?.places?.AutocompleteSuggestion) {
      googleInstance = (window as any).google;
      setGoogle(googleInstance);
      setLoading(false);
      return;
    }

    // Chain onto any existing initGoogleServices callback (e.g. from GoogleMap.tsx)
    // so only one Maps JS script tag is ever injected per page.
    const prev = (window as any).initGoogleServices;
    (window as any).initGoogleServices = async () => {
      if (prev) await prev();
      await (window as any).google.maps.importLibrary("places");
      googleInstance = (window as any).google;
      setGoogle(googleInstance);
      setLoading(false);
    };

    if (!document.querySelector('script[src*="maps.googleapis.com"]')) {
      loadJS(
        `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY}&loading=async&callback=initGoogleServices`,
        () => {},
        (err) => {
          console.error(`Failed to load Google Places Script: ${err}`);
          setError(`Something went wrong please try again later`);
          setLoading(false);
        }
      );
    }
  }, []);

  return [google, loading, error];
};
