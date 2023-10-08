import { useEffect, useMemo, useRef, useState } from "react";
import { AutocompleteAddress } from "@/types";
import { TextInput } from "@tremor/react";
import { useGooglePlaces } from "@/app/lib/hooks/useGoogleServices";

type AutocompleteProps = {
  onLocalityChange?: (locality: string) => void;
  onAddressChange?: (address: AutocompleteAddress) => void;
  initialValue?: string;
  submitBtnType?: string;
};

export const AddressAutocomplete = ({
  onLocalityChange,
  onAddressChange,
  initialValue,
}: AutocompleteProps) => {
  const [address, setAddress] = useState({
    streetNumber: "",
    route: "",
    locality: "",
    administrativeAreaLevelOne: "",
    postalCode: "",
    neighborhood: "",
    latitude: "",
    longitude: "",
  });
  const [inputValue, setInputValue] = useState(initialValue || "");
  const firstUpdate = useRef(true);

  const autoCompleteRef = useRef();
  const inputRef = useRef();
  const options = useMemo(() => ({
    componentRestrictions: { country: "bg" },
    fields: ["address_components", "geometry", "name"],
    types: ["address"],
  }), []);

  const [googleInstance, isLoading, loadError] = useGooglePlaces();

  // Tracking address changes
  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }

    if (address && onAddressChange) {
      onAddressChange(address);
    }

    if (address.locality && onLocalityChange) {
      onLocalityChange(address.locality);
    }
  }, [address]);

  const placeChanged = (e) => {
    // Get the place details from the autocomplete object.
    const place = autoCompleteRef.current.getPlace();
    if (!place || !place.address_components) return;

    let streetNumber = "";
    let route = "";
    let locality = "";
    let administrativeAreaLevelOne = "";
    let postalCode = "";
    let neighborhood = "";

    // Get each component of the address from the place details,
    // and then fill-in the corresponding field on the form.
    // place.address_components are google.maps.GeocoderAddressComponent objects
    // which are documented at http://goo.gle/3l5i5Mr
    for (const component of place.address_components as google.maps.GeocoderAddressComponent[]) {
      const componentType = component.types[0];

      switch (componentType) {
        case "street_number": {
          streetNumber = component.long_name;
          break;
        }
        case "route": {
          route = component.long_name;
          break;
        }
        case "neighborhood": {
          neighborhood = component.long_name;
          break;
        }

        case "postal_code": {
          postalCode = component.long_name;
          break;
        }
        case "locality":
          locality = component.long_name;
          break;

        case "administrative_area_level_1": {
          administrativeAreaLevelOne = component.long_name;
          break;
        }
      }
    }

    // Set address state
    setAddress({
      streetNumber,
      route,
      locality,
      administrativeAreaLevelOne,
      postalCode,
      neighborhood,
      latitude: place?.geometry?.location?.lat()?.toString(),
      longitude: place?.geometry?.location?.lng()?.toString(),
    });
  };

  useEffect(() => {
    if (googleInstance && googleInstance.maps && googleInstance.maps.places) {
      autoCompleteRef.current = new googleInstance.maps.places.Autocomplete(inputRef.current, options);

      // When the user selects an address from the drop-down, populate the
      // address fields in the form.
      autoCompleteRef.current.addListener("place_changed", placeChanged);
    }
  }, [googleInstance, options]);

  return (
    <>
      <TextInput name="address" id="address" ref={inputRef} />
    </>
  );
};
