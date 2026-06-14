"use client";
import { useEffect, useRef, useState } from "react";
import { AutocompleteAddress } from "@/types";
import { TextInput } from "@tremor/react";
import { useGooglePlaces } from "@/app/lib/hooks/useGoogleServices";

type AutocompleteProps = {
  onLocalityChange?: (locality: string) => void;
  onAddressChange?: (address: AutocompleteAddress) => void;
  initialValue?: string;
};

export const AddressAutocomplete = ({
  onLocalityChange,
  onAddressChange,
  initialValue,
}: AutocompleteProps) => {
  const [inputValue, setInputValue] = useState(initialValue || "");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const firstUpdate = useRef(true);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [googleInstance] = useGooglePlaces();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch suggestions with debounce
  useEffect(() => {
    if (!googleInstance?.maps?.places?.AutocompleteSuggestion) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    setIsFetching(true);
    const timer = setTimeout(async () => {
      try {
        const { suggestions: results } =
          await googleInstance.maps.places.AutocompleteSuggestion.fetchAutocompleteSuggestions({
            input: inputValue,
            includedRegionCodes: ["bg"],
            includedPrimaryTypes: ["street_address", "route"],
          });
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

  const handleSuggestionSelect = async (suggestion: any) => {
    if (firstUpdate.current) firstUpdate.current = false;

    const place = suggestion.placePrediction.toPlace();
    await place.fetchFields({ fields: ["addressComponents", "location"] });

    let streetNumber = "", route = "", locality = "", administrativeAreaLevelOne = "", postalCode = "", neighborhood = "";

    for (const component of place.addressComponents ?? []) {
      switch (component.types[0]) {
        case "street_number": streetNumber = component.longText; break;
        case "route": route = component.longText; break;
        case "neighborhood": neighborhood = component.longText; break;
        case "postal_code": postalCode = component.longText; break;
        case "locality": locality = component.longText; break;
        case "administrative_area_level_1": administrativeAreaLevelOne = component.longText; break;
      }
    }

    const address: AutocompleteAddress = {
      streetNumber, route, locality, administrativeAreaLevelOne,
      postalCode, neighborhood,
      latitude: place.location?.lat()?.toString() ?? "",
      longitude: place.location?.lng()?.toString() ?? "",
    };

    setInputValue(suggestion.placePrediction.text.text);
    setSuggestions([]);
    setShowDropdown(false);

    if (onAddressChange) onAddressChange(address);
    if (locality && onLocalityChange) onLocalityChange(locality);
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <TextInput
        name="address"
        id="address"
        value={inputValue}
        placeholder="Start typing an address..."
        onChange={(e) => setInputValue(e.target.value)}
        onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
        autoComplete="off"
      />

      {isFetching && inputValue && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
          {[1, 2, 3].map((i) => (
            <div key={i} className="px-4 py-3 border-b border-gray-100 last:border-0 animate-pulse">
              <div className="flex items-center gap-2">
                <div className="h-3.5 bg-gray-200 rounded w-36" />
                <div className="h-3 bg-gray-100 rounded w-24" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!isFetching && showDropdown && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
          {suggestions.map((suggestion, i) => (
            <button
              key={i}
              type="button"
              className="w-full text-left px-4 py-3 hover:bg-[#EDF0F7] text-[#2D3648] text-sm transition-colors border-b border-gray-100 last:border-0"
              onMouseDown={(e) => {
                e.preventDefault();
                handleSuggestionSelect(suggestion);
              }}
            >
              <span className="font-medium">{suggestion.placePrediction.mainText?.text}</span>
              {suggestion.placePrediction.secondaryText?.text && (
                <span className="text-[#717D96] ml-1">{suggestion.placePrediction.secondaryText.text}</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
