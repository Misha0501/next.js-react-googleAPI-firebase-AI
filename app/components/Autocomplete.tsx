import {useEffect, useRef, useState} from "react";
import {MagnifyingGlassIcon} from "@heroicons/react/24/solid";
import {AutocompleteAddress,} from "@/types";
import { Button, Icon } from "@tremor/react";

window.initMap = function (e) {
  console.log(e);
  console.log("in init map");
};

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
  autocompleteType,
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

  const autoCompleteRef = useRef();
  const inputRef = useRef();
  const options = {
    componentRestrictions: { country: "bg" },
    fields: ["address_components", "geometry", "name"],
    types: ["(cities)"],
  };

  // Tracking address changes
  useEffect(() => {
    if (address && onAddressChange) {
      onAddressChange(address);
    }

    if (address.locality && onLocalityChange) {
      setInputValue(address.locality);
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
      // console.log(component);
      // console.log(componentType);
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
      latitude: place?.geometry?.location?.lat(),
      longitude: place?.geometry?.location?.lng(),
    });
  };

  useEffect(() => {
    if (window.google) {
      autoCompleteRef.current = new window.google.maps.places.Autocomplete(
        inputRef.current,
        options
      );

      // When the user selects an address from the drop-down, populate the
      // address fields in the form.
      autoCompleteRef.current.addListener("place_changed", placeChanged);
    }
  }, [window.google]);

  return (
    <div className="py-2 pl-3 pr-2 flex justify-between m-auto w-full  bg-white border-[#CBD2E0] rounded-lg h-16">
      <Icon
        icon={MagnifyingGlassIcon}
        size="lg"
        className="text-black hidden lg:flex"
      />

      <input
        className="hero__search w-full border-none pl-0 lg:pl-2 outline-none focus:outline-none text-black focus:border-none active:border-none active:outline-none"
        // icon={MagnifyingGlassIcon}
        type={"text"}
        placeholder={"E.g: Sophia, Plovdiv, Varna"}
        ref={inputRef}
        name={"locality"}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <Button
        type={"submit"}
        variant={"primary"}
      >
        Search
      </Button>
    </div>
  );
};
export default AutoComplete;
