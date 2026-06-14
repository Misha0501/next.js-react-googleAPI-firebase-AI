"use client";
import { useEffect, useRef, useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { AutocompleteAddress } from "@/types";
import { Button, Icon } from "@tremor/react";
import { useGooglePlaces } from "@/app/lib/hooks/useGoogleServices";

const PRESET_CITIES = ["Sofia", "Plovdiv", "Varna", "Burgas", "Ruse", "Pleven", "Sliven"];

type AutocompleteProps = {
  onLocalityChange?: (locality: string) => void;
  onAddressChange?: (address: AutocompleteAddress) => void;
  initialValue?: string;
  submitBtnType?: string;
  autocompleteType?: string;
};

const AutoComplete = ({
  onLocalityChange,
  onAddressChange,
  initialValue,
}: AutocompleteProps) => {
  const [inputValue, setInputValue] = useState(initialValue || "");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const userTyping = useRef(false);
  const [googleInstance] = useGooglePlaces();

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
        setShowPresets(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch suggestions with debounce — only when the user is actively typing
  useEffect(() => {
    if (!userTyping.current || !googleInstance?.maps?.places?.AutocompleteSuggestion) {
      return;
    }

    setIsFetching(true);
    const timer = setTimeout(async () => {
      try {
        const { suggestions: results } =
          await googleInstance.maps.places.AutocompleteSuggestion.fetchAutocompleteSuggestions({
            input: inputValue,
            includedRegionCodes: ["bg"],
            includedPrimaryTypes: ["locality"],
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

  const handlePresetSelect = (city: string) => {
    userTyping.current = false;
    setInputValue(city);
    setShowPresets(false);
    setShowDropdown(false);
    if (onLocalityChange) onLocalityChange(city);
  };

  const handleSuggestionSelect = async (suggestion: any) => {
    const place = suggestion.placePrediction.toPlace();
    await place.fetchFields({ fields: ["addressComponents", "location", "displayName"] });

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

    const displayLocality = locality || place.displayName || "";
    userTyping.current = false;
    setInputValue(displayLocality);
    setSuggestions([]);
    setShowDropdown(false);
    setShowPresets(false);

    if (onAddressChange) {
      onAddressChange({ streetNumber, route, locality, administrativeAreaLevelOne, postalCode, neighborhood, latitude: place.location?.lat()?.toString() ?? "", longitude: place.location?.lng()?.toString() ?? "" });
    }
    if (onLocalityChange) onLocalityChange(displayLocality);
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className="py-2 pl-3 pr-2 flex items-center w-full bg-white border-[#CBD2E0] rounded-lg h-16 gap-2">
        <Icon icon={MagnifyingGlassIcon} size="lg" className="text-black flex shrink-0" />
        <input
          ref={inputRef}
          className="w-full border-none outline-none focus:outline-none text-black bg-transparent pl-0 lg:pl-2"
          type="text"
          placeholder="E.g: Sofia, Plovdiv, Varna"
          name="locality"
          value={inputValue}
          onChange={(e) => {
            userTyping.current = true;
            setInputValue(e.target.value);
            setShowPresets(false);
          }}
          onFocus={() => {
            if (!userTyping.current && !inputValue) {
              setShowPresets(true);
            } else if (suggestions.length > 0) {
              setShowDropdown(true);
            }
          }}
          autoComplete="off"
        />
        <Button type="submit" variant="primary">
          Search
        </Button>
      </div>

      {showPresets && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
          <p className="px-4 pt-2.5 pb-1 text-[0.65rem] uppercase tracking-widest text-[#717D96]">Popular cities</p>
          {PRESET_CITIES.map((city) => (
            <button
              key={city}
              type="button"
              className="w-full text-left px-4 py-2.5 hover:bg-[#EDF0F7] text-[#2D3648] text-sm transition-colors border-b border-gray-100 last:border-0"
              onMouseDown={(e) => { e.preventDefault(); handlePresetSelect(city); }}
            >
              <span className="font-medium">{city}</span>
              <span className="text-[#717D96] ml-1">Bulgaria</span>
            </button>
          ))}
        </div>
      )}

      {isFetching && inputValue && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
          {[1, 2, 3].map((i) => (
            <div key={i} className="px-4 py-3 border-b border-gray-100 last:border-0 animate-pulse">
              <div className="flex items-center gap-2">
                <div className="h-3.5 bg-gray-200 rounded w-24" />
                <div className="h-3 bg-gray-100 rounded w-32" />
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

export default AutoComplete;
