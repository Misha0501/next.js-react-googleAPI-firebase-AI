"use client";

import { Tab } from "@headlessui/react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { classNames } from "@/app/lib/classNames";
import {
  Button,
  Divider,
  NumberInput,
  Select,
  SelectItem,
  TextInput,
} from "@tremor/react";
import {
  CURRENCIES,
  HEATING_TYPES,
  INTERIOR_TYPES,
  UPKEEP_TYPES,
  PROPERTY_TYPES,
  LISTING_TYPES,
} from "@/app/Constants";
import {
  CurrencyType,
  HeatingType,
  InteriorType, ListingImage,
  ListingType,
  UpkeepType,
} from "@/types";
import PropertyPlacementRadioButtons from "@/app/components/PropertyPlacementRadioButtons";
import { getFetchUrl } from "@/app/lib/getFetchUrl";
import { useAuthContext } from "@/app/context/AuthContext";
import { PlacingPropertyImagesHandler } from "@/app/components/PlacingPropertyImagesHandler";

export const PlacePropertyForm = ({}) => {
  const { authToken } = useAuthContext();

  const [listingType, setListingType] = useState(null);
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
  const [currency, setCurrency] = useState<CurrencyType | null>(null);
  const [price, setPrice] = useState("");
  const [propertyType, setPropertyType] = useState(null);
  const [rooms, setRooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [parking, setParking] = useState("");
  const [floorNumber, setFloorNumber] = useState("");
  const [numberOfFloorsProperty, setNumberOfFloorsProperty] = useState("");
  const [numberOfFloorsCommon, setNumberOfFloorsCommon] = useState("");
  const [heatingType, setHeatingType] = useState<HeatingType>();
  const [areaLand, setAreaLand] = useState("");
  const [areaLiving, setAreaLiving] = useState("");
  const [areaTotal, setAreaTotal] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<ListingImage[]>([]);
  const [upkeepType, setUpkeepType] = useState<UpkeepType | null>(null);
  const [interiorType, setInteriorType] = useState<InteriorType | null>(null);
  const [yearBuilt, setYearBuilt] = useState(null);
  const [generatingDescription, setGeneratingDescription] = useState(false);

  // const handleImages = useCallback(() => {
  //         setFilterValues((prevFilterValues) => ({
  //           ...prevFilterValues,
  //
  //         }));
  //         // You can also call onParamsChange or perform any other actions here
  //     },
  //     [filterValues.bedroomRange]
  // );
  let autoCompleteRef = useRef();
  const inputRef = useRef();
  const googlePlacesAutocompleteOptions = {
    componentRestrictions: { country: "bg" },
    fields: ["address_components", "geometry", "name"],
    types: ["address"],
  };

  const generateDescription = () => {
    let formData = {
      listingType,
      streetNumber: streetNumber,
      route,
      locality,
      address: {
        streetNumber,
        route,
        locality,
        administrativeAreaLevelOne,
        postalCode,
        neighborhood,
      },
      currency,
      price: price ? Number(price) : null,
      propertyType,
      rooms: rooms ? Number(rooms) : null,
      bathrooms: bathrooms ? Number(bathrooms) : null,
      bedrooms: bedrooms ? Number(bedrooms) : null,
      parking: parking ? Number(parking) : null,
      floorNumber: floorNumber ? Number(floorNumber) : null,
      numberOfFloorsProperty: numberOfFloorsProperty
        ? Number(numberOfFloorsProperty)
        : null,
      numberOfFloorsCommon: numberOfFloorsCommon
        ? Number(numberOfFloorsCommon)
        : null,
      heatingType,
      areaLand: areaLand ? Number(areaLand) : null,
      areaLiving: areaLiving ? Number(areaLiving) : null,
      areaTotal: areaTotal ? Number(areaTotal) : null,
      upkeepType,
      interiorType,
      yearBuilt,
    };

    setGeneratingDescription(true);
    setDescription(
      "Writing a description for you, please wait... It can take up to 30 seconds.",
    );

    fetch(getFetchUrl(`api/generateDescription`), {
      method: "POST",
      cache: "no-store",
      headers: {
        "Content-type": "application/json",
        Authorization: authToken,
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data)
        setGeneratingDescription(false);
        setDescription(data);
      })
      .catch((error) => {
        console.error(error);
        console.error(error.message);
        setGeneratingDescription(false);
        setDescription(
          "Something went wrong, please try again later. Or write your own description.",
        );
      });
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
        googlePlacesAutocompleteOptions,
      );

      // When the user selects an address from the drop-down, populate the
      // address fields in the form.
      autoCompleteRef.current.addListener("place_changed", placeChanged);
    }
  }, [window.google]);

  const handleClick = () => {};

  const handleFormSubmit = (e: any) => {
    e.preventDefault();

    let formData = {
      listingType,
      streetNumber: streetNumber,
      address: {
        streetNumber,
        route,
        locality,
        administrativeAreaLevelOne,
        postalCode,
        neighborhood,
      },
      images,
      currency,
      price: price ? Number(price) : null,
      propertyType,
      rooms: rooms ? Number(rooms) : null,
      bathrooms: bathrooms ? Number(bathrooms) : null,
      bedrooms: bedrooms ? Number(bedrooms) : null,
      parking: parking ? Number(parking) : null,
      floorNumber: floorNumber ? Number(floorNumber) : null,
      numberOfFloorsProperty: numberOfFloorsProperty
        ? Number(numberOfFloorsProperty)
        : null,
      numberOfFloorsCommon: numberOfFloorsCommon
        ? Number(numberOfFloorsCommon)
        : null,
      heatingType,
      areaLand: areaLand ? Number(areaLand) : null,
      areaLiving: areaLiving ? Number(areaLiving) : null,
      areaTotal: areaTotal ? Number(areaTotal) : null,
      upkeepType,
      interiorType,
      yearBuilt,
    };

    console.log("formData");
    console.log(formData);

    fetch(getFetchUrl(`api/listings`), {
      method: "POST",
      cache: "no-store",
      headers: {
        "Content-type": "application/json",
        Authorization: authToken,
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error(error);
        console.error(error.message);
      });
  };

  // @ts-ignore
  return (
    <form
      onSubmit={handleFormSubmit}
      onKeyDown={(e) => {
        e.key === "Enter" && e.preventDefault();
      }}
    >
      <h3 className={"text-4xl font-bold max-w-xl mb-12"}>
        Add essential information about your company
      </h3>
      <div className="grid md:grid-cols-2 gap-8 md:gap-16">
        <p className={"text-2xl font-bold"}>
          Are you planning to rent or sell your property?
        </p>
        <div className="">
          <PropertyPlacementRadioButtons
            options={LISTING_TYPES}
            onChange={setListingType}
          />
        </div>
      </div>
      <Divider className={"my-8 md:my-14"} />
      <div className="grid md:grid-cols-2 gap-8 md:gap-16">
        <p className={"text-2xl font-bold"}>What is your property type</p>
        <Select onValueChange={setPropertyType} className={"text-sm"}>
          {PROPERTY_TYPES.map((item, index) => (
            <SelectItem value={item} key={index}>
              {item}
            </SelectItem>
          ))}
        </Select>
      </div>
      <Divider className={"my-8 md:my-14"} />
      <div className="grid md:grid-cols-2 gap-8 md:gap-16">
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
      <Divider className={"my-8 md:my-14"} />
      <div className="grid md:grid-cols-2 gap-8 md:gap-16">
        <p className={"text-2xl font-bold"}>What is your asking price</p>
        <div className="">
          <div className="mb-7">
            <p className={"mb-2"}>Select the currency</p>
            <Select onValueChange={setCurrency} className={"text-sm"}>
              {CURRENCIES.map((item, index) => (
                <SelectItem value={item} key={index}>
                  {item}
                </SelectItem>
              ))}
            </Select>
          </div>
          <div className="mb-7">
            <p className={"mb-2"}>Type your price</p>
            <NumberInput
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
            />
          </div>
        </div>
      </div>
      <Divider className={"my-8 md:my-14"} />
      <div className="grid md:grid-cols-2 gap-8 md:gap-16">
        <p className={"text-2xl font-bold"}>What is the number of rooms</p>
        <div className="">
          <div className="pb-8 border-b">
            <div className="flex justify-between items-center">
              <span>Rooms</span>
              <NumberInput
                className={"w-min"}
                min={0}
                max={100}
                value={rooms}
                onChange={(e) => setRooms(Number(e.target.value))}
              />
            </div>
          </div>
          <div className="py-6 border-b">
            <div className="flex justify-between items-center">
              <span>Bedrooms</span>
              <NumberInput
                className={"w-min"}
                min={0}
                max={100}
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
              />
            </div>
          </div>
          <div className="py-6 border-b">
            <div className="flex justify-between items-center">
              <span>Bathrooms</span>
              <NumberInput
                className={"w-min"}
                min={0}
                max={100}
                value={bathrooms}
                onChange={(e) => setBathrooms(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
      <Divider className={"my-8 md:my-14"} />
      <div className="grid md:grid-cols-2 gap-8 md:gap-16">
        <p className={"text-2xl font-bold"}>
          What is the condition of the property
        </p>
        <div className="">
          <PropertyPlacementRadioButtons
            options={UPKEEP_TYPES}
            onChange={setUpkeepType}
          />
        </div>
      </div>
      <Divider className={"my-8 md:my-14"} />
      <div className="grid md:grid-cols-2 gap-8 md:gap-16">
        <p className={"text-2xl font-bold"}>What is the interior type</p>
        <div className="">
          <PropertyPlacementRadioButtons
            options={INTERIOR_TYPES}
            onChange={setInteriorType}
          />
        </div>
      </div>
      <Divider className={"my-8 md:my-14"} />
      <div className="grid md:grid-cols-2 gap-8 md:gap-16">
        <p className={"text-2xl font-bold"}>
          What is the heating type of the property
        </p>
        <div className="">
          <PropertyPlacementRadioButtons
            options={HEATING_TYPES}
            onChange={setHeatingType}
          />
        </div>
      </div>
      <Divider className={"my-8 md:my-14"} />
      <div className="grid md:grid-cols-2 gap-8 md:gap-16">
        <p className={"text-2xl font-bold"}>
          What are the building specification?
        </p>
        <div className="">
          <div className="pb-8 border-b">
            <div className="flex justify-between items-center">
              <span>Year of built</span>
              <NumberInput
                className={"w-min"}
                min={2010}
                max={2040}
                value={yearBuilt}
                onChange={(e) => setYearBuilt(e.target.value)}
              />
            </div>
          </div>
          <div className="py-6 border-b">
            <div className="flex justify-between items-center">
              <span>Floors in the building</span>
              <NumberInput
                className={"w-min"}
                min={0}
                max={100}
                value={numberOfFloorsCommon}
                onChange={(e) => setNumberOfFloorsCommon(e.target.value)}
              />
            </div>
          </div>
          <div className="py-6 border-b">
            <div className="flex justify-between items-center">
              <span>Property located at floor number</span>
              <NumberInput
                className={"w-min"}
                min={0}
                max={100}
                value={floorNumber}
                onChange={(e) => setFloorNumber(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
      <Divider className={"my-8 md:my-14"} />

      <div className="grid md:grid-cols-2 gap-8 md:gap-16">
        <p className={"text-2xl font-bold"}>
          Write description about your property
        </p>
        <div className="">
          <p className={"font-semibold text-sm mb-2"}>Description</p>
          <p className={"text-sm text-gray-400 mb-3"}>
            Share what is special about your property
          </p>
          <Button
            variant={"secondary"}
            onClick={generateDescription}
            type={"button"}
          >
            Generate description
          </Button>
          <p className={"text-sm text-gray-400 mb-3"}>
            Based on previous inputs we will generate a description for your. It
            takes around 30 seconds.
          </p>
          <textarea
            value={description}
            disabled={generatingDescription}
            onChange={(e) => setDescription(e.target.value)}
            className={
              "border-2 rounded-xl w-full outline-0 min-h-[250px] p-2 text-gray-500"
            }
          />
        </div>
      </div>
      <Divider className={"my-8 md:my-14"} />

      <div className="grid md:grid-cols-2 gap-8 md:gap-16">
        <p className={"text-2xl font-bold"}>
          Upload your property images
        </p>
        <div className="">
          <PlacingPropertyImagesHandler onChange={setImages}/>
        </div>
      </div>
      <Divider className={"my-8 md:my-14"} />

      <div className="grid md:grid-cols-2 gap-8 md:gap-16 mt-10">
        <div className="div"></div>
        <Button type={"submit"} variant={"primary"} size={"xl"}>
          Create property
        </Button>
      </div>
    </form>
  );
};
