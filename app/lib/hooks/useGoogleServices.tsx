import { useEffect, useState } from 'react';
import { loadJS } from "@/app/lib/loadJS";

/**
 * Loads Google Places API and returns the google object
 */
export const useGooglePlaces = (): [any | undefined, boolean, string | null] => {
  const [google, setGoogle] = useState<any>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if ((window as any).google) {
      setGoogle((window as any).google);
      setLoading(false);
    } else {
      (window as any).initGoogleServices = () => {
        setGoogle((window as any).google);
        setLoading(false);
      };

      loadJS(
        `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY}&libraries=places&callback=initGoogleServices`,
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
