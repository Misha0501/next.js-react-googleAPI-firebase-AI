import { useEffect, useState } from 'react';
import { loadJS } from "@/app/lib/loadJS";

let googleInstance;

export const useGooglePlaces = (): [any | undefined, boolean, string | null] => {
  const [google, setGoogle] = useState<any>(googleInstance);
  const [loading, setLoading] = useState(!googleInstance);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!googleInstance) {
      if ((window as any).google) {
        setGoogle((window as any).google);
        setLoading(false);
        googleInstance = (window as any).google;
      } else {
        (window as any).initGoogleServices = () => {
          setGoogle((window as any).google);
          setLoading(false);
          googleInstance = (window as any).google;
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
    }
  }, []);

  return [google, loading, error];
};