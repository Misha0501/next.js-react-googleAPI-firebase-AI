"use client";
import { useEffect, useRef, useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { AutocompleteAddress } from "@/types";
import { useGooglePlaces } from "@/app/lib/hooks/useGoogleServices";

const PRESET_CITIES = [
  "Sofia",
  "Plovdiv",
  "Varna",
  "Burgas",
  "Ruse",
  "Pleven",
  "Sliven",
];

type AutocompleteProps = {
  onLocalityChange?: (locality: string) => void;
  onAddressChange?: (address: AutocompleteAddress) => void;
  initialValue?: string;
  submitBtnType?: string;
  autocompleteType?: string;
  variant?: "default" | "hero";
};

const AutoComplete = ({
  onLocalityChange,
  onAddressChange,
  initialValue,
  variant = "default",
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
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
        setShowPresets(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch suggestions with debounce — only when the user is actively typing
  useEffect(() => {
    if (
      !userTyping.current ||
      !googleInstance?.maps?.places?.AutocompleteSuggestion
    ) {
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
              includedPrimaryTypes: ["locality"],
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

  const handlePresetSelect = (city: string) => {
    userTyping.current = false;
    setInputValue(city);
    setShowPresets(false);
    setShowDropdown(false);
    if (onLocalityChange) onLocalityChange(city);
  };

  const handleSuggestionSelect = async (
    suggestion: google.maps.places.AutocompleteSuggestion,
  ) => {
    if (!suggestion.placePrediction) return;
    const place = suggestion.placePrediction.toPlace();
    await place.fetchFields({
      fields: ["addressComponents", "location", "displayName"],
    });

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

    const displayLocality = locality || place.displayName || "";
    userTyping.current = false;
    setInputValue(displayLocality);
    setSuggestions([]);
    setShowDropdown(false);
    setShowPresets(false);

    if (onAddressChange) {
      onAddressChange({
        streetNumber,
        route,
        locality,
        administrativeAreaLevelOne,
        postalCode,
        neighborhood,
        latitude: place.location?.lat()?.toString() ?? "",
        longitude: place.location?.lng()?.toString() ?? "",
      });
    }
    if (onLocalityChange) onLocalityChange(displayLocality);
  };

  const isHero = variant === "hero";

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div
        className={`flex w-full items-center gap-2 bg-white ${
          isHero
            ? "min-h-[72px] rounded-2xl border border-white/80 py-2 pl-5 pr-2.5 shadow-[0_30px_80px_rgba(15,23,42,0.28)]"
            : "h-16 rounded-lg border-[#CBD2E0] py-2 pl-3 pr-2"
        }`}
      >
        <MagnifyingGlassIcon className="h-5 w-5 shrink-0 text-[#1F5FD6]" />
        <input
          ref={inputRef}
          className={`w-full border-none bg-transparent pl-0 text-[#1F2937] outline-none placeholder:text-[#9AA3B2] focus:outline-none lg:pl-2 ${
            isHero ? "text-lg font-semibold" : ""
          }`}
          type="text"
          placeholder="Search Sofia, Plovdiv, Varna..."
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
        <button
          type="submit"
          className={
            isHero
              ? "flex items-center justify-center self-stretch rounded-xl bg-[#1F5FD6] px-6 text-base font-bold text-white transition hover:bg-[#184FB5]"
              : "h-12 shrink-0 rounded-xl bg-[#1F5FD6] px-5 text-sm font-semibold text-white transition hover:bg-[#184FB5]"
          }
        >
          Search
        </button>
      </div>

      {showPresets && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">
          <p className="px-4 pb-1 pt-2.5 text-[0.65rem] uppercase tracking-widest text-[#717D96]">
            Popular cities
          </p>
          {PRESET_CITIES.map((city) => (
            <button
              key={city}
              type="button"
              className="w-full border-b border-gray-100 px-4 py-2.5 text-left text-sm text-[#2D3648] transition-colors last:border-0 hover:bg-[#EDF0F7]"
              onMouseDown={(e) => {
                e.preventDefault();
                handlePresetSelect(city);
              }}
            >
              <span className="font-medium">{city}</span>
              <span className="ml-1 text-[#717D96]">Bulgaria</span>
            </button>
          ))}
        </div>
      )}

      {isFetching && inputValue && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="animate-pulse border-b border-gray-100 px-4 py-3 last:border-0"
            >
              <div className="flex items-center gap-2">
                <div className="h-3.5 w-24 rounded bg-gray-200" />
                <div className="h-3 w-32 rounded bg-gray-100" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!isFetching && showDropdown && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">
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

export default AutoComplete;
