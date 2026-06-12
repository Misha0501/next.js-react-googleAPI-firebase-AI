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

    // loading=async without libraries=places so importLibrary loads the NEW
    // Places API (which has AutocompleteSuggestion). The legacy libraries=places
    // param only loads the old API and does not include AutocompleteSuggestion.
    (window as any).initGoogleServices = async () => {
      await (window as any).google.maps.importLibrary("places");
      googleInstance = (window as any).google;
      setGoogle(googleInstance);
      setLoading(false);
    };

    loadJS(
      `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY}&loading=async&callback=initGoogleServices`,
      () => {},
      (err) => {
        console.error(`Failed to load Google Places Script: ${err}`);
        setError(`Something went wrong please try again later`);
        setLoading(false);
      }
    );
  }, []);

  return [google, loading, error];
};
