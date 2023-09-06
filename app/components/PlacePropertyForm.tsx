"use client";

import { Tab } from "@headlessui/react";
import { useEffect, useRef, useState } from "react";
import { classNames } from "@/app/lib/classNames";
import { Divider, Select, SelectItem, TextInput } from "@tremor/react";

const propertyTypesInitialState = [
  // {dbId: '-1', label: 'Select',},
  { dbId: "1", label: "Residential building" },
  { dbId: "2", label: "Apartment" },
];

export const PlacePropertyForm = ({}) => {
  const [listingTypeSelectedIndex, setListingTypeSelectedIndex] = useState(0);
  const [listingTypeSelected, setListingTypeSelected] = useState("SELL");
  const [streetNumber, setStreetNumber] = useState("");
  const [route, setRoute] = useState("");
  const [locality, setLocality] = useState("");
  const [administrativeAreaLevelOne, setAdministrativeAreaLevelOne] =
    useState("");
  const [postalCode, setPostalCode] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [example, setExample] = useState('ul. "Sofia" 2, Ruse, Bulgaria');
  const [showFullAddress, setShowFullAddress] = useState(false);

  // const [listingTypeSelected, setListingTypeSelected] = useState('SELL')
  // const []

  const [selectedPropertyType, setSelectedPropertyType] = useState();

  let autoCompleteRef = useRef();
  const inputRef = useRef();
  const options = {
    componentRestrictions: { country: "bg" },
    fields: ["address_components", "geometry", "name"],
    types: ["address"],
  };

  const placeChanged = (e) => {
    console.log(e);
    console.log("Place changed");
    // Get the place details from the autocomplete object.
    const place = autoCompleteRef.current.getPlace();
    if (!place || !place.address_components) return;

    setShowFullAddress(true);

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

    // set address varibles
    setRoute(route);
    setLocality(locality);
    setAdministrativeAreaLevelOne(administrativeAreaLevelOne);
    setStreetNumber(streetNumber);
    setPostalCode(postalCode);
    setNeighborhood(neighborhood);

    // set latitude and longitude
    if (place.geometry && place.geometry.location) {
      setLatitude(place.geometry.location.lat());
      setLongitude(place.geometry.location.lng());
    }
  };

  useEffect(() => {
    if (window.google) {
      autoCompleteRef.current = new window.google.maps.places.Autocomplete(
        inputRef.current,
        options,
      );

      // When the user selects an address from the drop-down, populate the
      // address fields in the form.
      autoCompleteRef.current.addListener("place_changed", placeChanged);
    }
  }, [window.google]);

  const handleClick = () => {
    // console.log("hande")
    // setStreetNumber('23')
  };

  return (
    <div className="">
      <h3 className={"text-4xl font-bold max-w-xl mb-12"}>
        Add essential information about your company
      </h3>
      <div className="grid grid-cols-2 gap-16">
        <p className={"text-2xl font-bold"}>
          Are you planning to rent or sell your property?
        </p>
        <Tab.Group
          selectedIndex={listingTypeSelectedIndex}
          onChange={setListingTypeSelectedIndex}
        >
          <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1 mb-5 w-full text-black">
            <Tab
              className={({ selected }) =>
                classNames(
                  "w-full rounded-lg py-2.5 text-sm font-medium leading-5",
                  "ring-white ring-opacity-60 focus:outline-none ",
                  selected
                    ? "bg-white shadow"
                    : "text-gray-100 bg-white/[0.12] text-white",
                )
              }
            >
              Buy
            </Tab>
            <Tab
              className={({ selected }) =>
                classNames(
                  "w-full rounded-lg py-2.5 text-sm font-medium leading-5",
                  "ring-white ring-opacity-60 focus:outline-none ",
                  selected
                    ? "bg-white shadow"
                    : "text-gray-100 bg-white/[0.12] text-white",
                )
              }
            >
              Rent
            </Tab>
          </Tab.List>
        </Tab.Group>
      </div>
      <Divider />
      <div className="grid grid-cols-2 gap-16">
        <p className={"text-2xl font-bold"}>What is your property type</p>
        <Select onValueChange={setSelectedPropertyType} className={"text-sm"}>
          {propertyTypesInitialState.map((item, index) => (
            <SelectItem value={item.label} key={index}>
              {item.label}
            </SelectItem>
          ))}
        </Select>
      </div>
      <Divider />
      <div className="grid grid-cols-2 gap-16">
        <p className={"text-2xl font-bold"}>
          What is the location of your property
        </p>
        <div className="">
          <div className="mb-7">
            <p className={"mb-2"}>Type your address</p>
            <p>Example: {example}</p>
            <TextInput ref={inputRef} />
          </div>

          {showFullAddress && (
            <div className="">
              <div className="mb-7">
                <p className={"mb-2"}>House number</p>
                <TextInput
                  value={streetNumber}
                  onChange={(e) => setStreetNumber(e.target.value)}
                />
              </div>
              <div className="mb-7">
                <p className={"mb-2"}>Street</p>
                <TextInput
                  value={route}
                  onChange={(e) => setRoute(e.target.value)}
                />
              </div>
              <div className="mb-7">
                <p className={"mb-2"}>City</p>
                <TextInput
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                />
              </div>
              <div className="mb-7">
                <p className={"mb-2"}>Administrative area</p>
                <TextInput
                  value={administrativeAreaLevelOne}
                  onChange={(e) =>
                    setAdministrativeAreaLevelOne(e.target.value)
                  }
                />
              </div>
              <div className="mb-7">
                <p className={"mb-2"}>Postal code</p>
                <TextInput
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                />
              </div>
              <div className="mb-7">
                <p className={"mb-2"}>Latitude</p>
                <TextInput
                  value={latitude}
                  onChange={(e) => setPostalCode(e.target.value)}
                />
              </div>
              <div className="mb-7">
                <p className={"mb-2"}>Longitude</p>
                <TextInput
                  value={longitude}
                  onChange={(e) => setPostalCode(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
