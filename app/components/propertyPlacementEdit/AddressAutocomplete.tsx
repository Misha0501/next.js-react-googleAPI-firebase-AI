"use client";
import { useEffect, useRef, useState } from "react";
import { AutocompleteAddress } from "@/types";
import { useGooglePlaces } from "@/app/lib/hooks/useGoogleServices";

type AutocompleteProps = {
  onLocalityChange?: (locality: string) => void;
  onAddressChange?: (address: AutocompleteAddress) => void;
  initialValue?: string;
};

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-[#1F2937] outline-none transition focus:border-[#1F5FD6] focus:ring-2 focus:ring-[#1F5FD6]/15";

export const AddressAutocomplete = ({
  onLocalityChange,
  onAddressChange,
  initialValue,
}: AutocompleteProps) => {
  const [inputValue, setInputValue] = useState(initialValue || "");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const justSelected = useRef(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [googleInstance] = useGooglePlaces();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch suggestions with debounce
  useEffect(() => {
    if (justSelected.current) {
      justSelected.current = false;
      return;
    }

    if (!googleInstance?.maps?.places?.AutocompleteSuggestion) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    setIsFetching(true);
    const timer = setTimeout(async () => {
      try {
        const { suggestions: results } =
          await googleInstance.maps.places.AutocompleteSuggestion.fetchAutocompleteSuggestions(
            {
              input: inputValue,
              includedRegionCodes: ["bg"],
              includedPrimaryTypes: ["street_address", "route"],
            },
          );
        setSuggestions(results || []);
        setShowDropdown((results || []).length > 0);
      } catch {
        setSuggestions([]);
      } finally {
        setIsFetching(false);
      }
    }, 300);

    return () => {
      clearTimeout(timer);
      setIsFetching(false);
    };
  }, [inputValue, googleInstance]);

  const handleSuggestionSelect = async (
    suggestion: google.maps.places.AutocompleteSuggestion,
  ) => {
    if (!suggestion.placePrediction) return;

    const place = suggestion.placePrediction.toPlace();
    await place.fetchFields({ fields: ["addressComponents", "location"] });

    let streetNumber = "",
      route = "",
      locality = "",
      administrativeAreaLevelOne = "",
      postalCode = "",
      neighborhood = "";

    for (const component of place.addressComponents ?? []) {
      switch (component.types[0]) {
        case "street_number":
          streetNumber = component.longText ?? "";
          break;
        case "route":
          route = component.longText ?? "";
          break;
        case "neighborhood":
          neighborhood = component.longText ?? "";
          break;
        case "postal_code":
          postalCode = component.longText ?? "";
          break;
        case "locality":
          locality = component.longText ?? "";
          break;
        case "administrative_area_level_1":
          administrativeAreaLevelOne = component.longText ?? "";
          break;
      }
    }

    const address: AutocompleteAddress = {
      streetNumber,
      route,
      locality,
      administrativeAreaLevelOne,
      postalCode,
      neighborhood,
      latitude: place.location?.lat()?.toString() ?? "",
      longitude: place.location?.lng()?.toString() ?? "",
    };

    justSelected.current = true;
    setInputValue(suggestion.placePrediction.text.text);
    setSuggestions([]);
    setShowDropdown(false);

    if (onAddressChange) onAddressChange(address);
    if (locality && onLocalityChange) onLocalityChange(locality);
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <input
        type="text"
        name="address"
        id="address"
        value={inputValue}
        placeholder="Start typing an address..."
        onChange={(e) => setInputValue(e.target.value)}
        onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
        autoComplete="off"
        className={inputClass}
      />

      {isFetching && inputValue && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="animate-pulse border-b border-gray-100 px-4 py-3 last:border-0"
            >
              <div className="flex items-center gap-2">
                <div className="h-3.5 w-36 rounded bg-gray-200" />
                <div className="h-3 w-24 rounded bg-gray-100" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!isFetching && showDropdown && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
          {suggestions.map((suggestion, i) => (
            <button
              key={i}
              type="button"
              className="w-full border-b border-gray-100 px-4 py-3 text-left text-sm text-[#2D3648] transition-colors last:border-0 hover:bg-[#EDF0F7]"
              onMouseDown={(e) => {
                e.preventDefault();
                handleSuggestionSelect(suggestion);
              }}
            >
              <span className="font-medium">
                {suggestion.placePrediction.mainText?.text}
              </span>
              {suggestion.placePrediction.secondaryText?.text && (
                <span className="ml-1 text-[#717D96]">
                  {suggestion.placePrediction.secondaryText.text}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
