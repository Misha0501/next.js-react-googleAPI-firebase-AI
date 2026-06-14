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

    // Maps JS already loaded (e.g. by GoogleMap.tsx) but places not imported yet.
    // importLibrary directly rather than waiting for a callback that already fired.
    if ((window as any).google?.maps) {
      (window as any).google.maps.importLibrary("places").then(() => {
        googleInstance = (window as any).google;
        setGoogle(googleInstance);
        setLoading(false);
      }).catch((err: any) => {
        console.error("Failed to import Places library:", err);
        setError("Something went wrong please try again later");
        setLoading(false);
      });
      return;
    }

    // Script not yet loaded — chain onto any existing callback so only one
    // script tag is ever injected per page.
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
