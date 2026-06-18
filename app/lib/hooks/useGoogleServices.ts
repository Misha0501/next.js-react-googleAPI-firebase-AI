import { useEffect, useState } from "react";
import { loadJS } from "@/app/lib/loadJS";

type GoogleInstance = typeof google;

let googleInstance: GoogleInstance | undefined;

export const useGooglePlaces = (): [
  GoogleInstance | undefined,
  boolean,
  string | null,
] => {
  const [googleState, setGoogleState] = useState<GoogleInstance | undefined>(
    googleInstance,
  );
  const [loading, setLoading] = useState(!googleInstance);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (googleInstance) return;
    let cancelled = false;

    const win = window as Window & {
      google?: GoogleInstance;
      initGoogleServices?: (...args: unknown[]) => Promise<void>;
    };

    const setLoadedGoogle = () => {
      if (cancelled || !win.google) return;
      googleInstance = win.google;
      setGoogleState(googleInstance);
      setLoading(false);
    };

    if (win.google?.maps?.places?.AutocompleteSuggestion) {
      const timer = window.setTimeout(setLoadedGoogle, 0);
      return () => {
        cancelled = true;
        window.clearTimeout(timer);
      };
    }

    // Maps JS already loaded (e.g. by GoogleMap.tsx) but places not imported yet.
    // importLibrary directly rather than waiting for a callback that already fired.
    if (win.google?.maps) {
      win.google.maps
        .importLibrary("places")
        .then(() => {
          setLoadedGoogle();
        })
        .catch((err: unknown) => {
          if (cancelled) return;
          console.error("Failed to import Places library:", err);
          setError("Something went wrong please try again later");
          setLoading(false);
        });
      return;
    }

    // Script not yet loaded — chain onto any existing callback so only one
    // script tag is ever injected per page.
    const prev = win.initGoogleServices;
    win.initGoogleServices = async () => {
      if (prev) await prev();
      await win.google!.maps.importLibrary("places");
      setLoadedGoogle();
    };

    if (!document.querySelector('script[src*="maps.googleapis.com"]')) {
      loadJS(
        `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY}&loading=async&callback=initGoogleServices`,
        () => {},
        (err) => {
          if (cancelled) return;
          console.error(`Failed to load Google Places Script: ${err}`);
          setError(`Something went wrong please try again later`);
          setLoading(false);
        },
      );
    }

    return () => {
      cancelled = true;
    };
  }, []);

  return [googleState, loading, error];
};
