"use client";
import { ArrowSmallRightIcon } from "@heroicons/react/24/solid";
import {
  Button,
  Divider,
  Icon,
  NumberInput,
  Select,
  SelectItem,
  TextInput,
} from "@tremor/react";
import property1 from "@/public/property1.png";
import StepsTopInfo from "./StepsTopInfo";
import { CURRENCIES, LISTING_TYPES, PROPERTY_TYPES } from "@/app/Constants";
import { useEffect, useRef, useState } from "react";
import PropertyPlacementRadioButtons from "../PropertyPlacementRadioButtons";
import { AntSwitch } from "./Styled";
import { FormHelperText } from "@mui/material";

const GeneralInfo = (props: any) => {
  const { formik, handleNext, step, isShow } = props;

  const [show, setShow] = useState(true);
  const [showError, setShowErros] = useState(false);
  const [showAddress, setShowAddress] = useState(false);
  const title = "Add essential information about your property";
  const stepNumber = "Step 1";

  let autoCompleteRef = useRef();
  const inputRef = useRef();
  const googlePlacesAutocompleteOptions = {
    componentRestrictions: { country: "bg" },
    fields: ["address_components", "geometry", "name"],
    types: ["address"],
  };
  const placeChanged = (e) => {
    // Get the place details from the autocomplete object.
    const place = autoCompleteRef.current.getPlace();
    if (!place || !place.address_components) return;
    setShowAddress(true);
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

    if (place) {
      formik.setFieldValue("street", route);
      formik.setFieldValue("housenumber", streetNumber);
      formik.setFieldValue("city", locality);
      formik.setFieldValue("administrativeArea", administrativeAreaLevelOne);
      formik.setFieldValue("postalCode", postalCode);
    }

    if (place.geometry && place.geometry.location) {
      formik.setFieldValue("latitude", place.geometry.location.lat());
      formik.setFieldValue("longitude", place.geometry.location.lng());
    }
  };
  useEffect(() => {
    if (window.google) {
      autoCompleteRef.current = new window.google.maps.places.Autocomplete(
        inputRef.current,
        googlePlacesAutocompleteOptions
      );

      // When the user selects an address from the drop-down, populate the
      // address fields in the form.
      autoCompleteRef.current.addListener("place_changed", placeChanged);
    }
  }, [window.google]);

  const validateStep1 = (e) => {
    event?.preventDefault();
    let errors: any = {};
    if (!formik.values.listingType) {
      errors.listingType = "Required";
    }
    if (!formik.values.propertyType) {
      errors.propertyType = "Required";
    }
    // if (!formik.values.address) {
    //   errors.address = "Required";
    // }
    if (!formik.values.currency) {
      errors.currency = "Required";
    }
    if (!formik.values.price) {
      errors.price = "Required";
    }

    return errors;
  };
  return (
    <>
      <div className="max-w-screen-xl m-auto">
        {isShow && show ? (
          <StepsTopInfo
            stepNumber={stepNumber}
            title={title}
            description="In this step we will ask you information about your intention whether you’re renting or selling a property. We will also acquire information about your property, its type, location, specifics and special characteristics."
            imageSrc={property1}
            step={step}
            onClick={() => setShow(false)}
          />
        ) : (
          <div>
            <div className="grid grid-cols-2 py-10 w-full gap-20 items-center">
              <div>
                <p className="text-[18px] text-[#222]">{stepNumber}</p>
                <h4
                  className="text-[40px] font-bold py-10"
                  style={{ lineHeight: "120%" }}
                >
                  {title}
                </h4>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-8 md:gap-16">
              <p className={"text-2xl font-bold"}>
                Are you planning to rent or sell your property?
              </p>
              <div className="">
                <PropertyPlacementRadioButtons
                  value={formik.values.listingType}
                  options={LISTING_TYPES}
                  onChange={(e) => formik.setFieldValue("listingType", e, true)}
                  id="listingType"
                />
                {formik.touched.listingType && formik.errors.listingType && (
                  <FormHelperText error>
                    {formik.errors.listingType}
                  </FormHelperText>
                )}
              </div>
            </div>
            <Divider className={"my-8 md:my-14"} />
            <div className="grid md:grid-cols-2 gap-8 md:gap-16">
              <p className={"text-2xl font-bold"}>What is your property type</p>
              <div>
                <Select
                  id="propertyType"
                  onChange={(e) =>
                    formik.setFieldValue("propertyType", e, true)
                  }
                  value={formik.values.propertyType}
                  onBlur={formik.handleBlur("propertyType")}
                >
                  {PROPERTY_TYPES.map((item, index) => (
                    <SelectItem value={item} key={index}>
                      {item}
                    </SelectItem>
                  ))}
                </Select>
                {showError && formik.errors.propertyType && (
                  <FormHelperText error>
                    {formik.errors.propertyType}
                  </FormHelperText>
                )}
              </div>
            </div>
            <Divider className={"my-8 md:my-14"} />
            <div className="grid md:grid-cols-2 gap-8 md:gap-16">
              <p className={"text-2xl font-bold"}>
                What is the location of your property
              </p>
              <div className="">
                <div className="mb-7">
                  <p className={"mb-2"}>Type your address</p>
                  {/* <TextInput
                    name="address"
                    id="address"
                    onChange={formik.handleChange}
                    error={!!formik.errors.address && !!formik.touched.address}
                    value={formik.values.address}
                    onBlur={formik.handleBlur}
                  /> */}
                  <TextInput name="address" id="address" ref={inputRef} />
                </div>
                <div className="mb-7">
                  <div className="flex items-center gap-2 mb-7">
                    <AntSwitch
                      defaultChecked
                      inputProps={{ "aria-label": "ant design" }}
                    />
                    <h4 className="text-[16px] font-bold">
                      Show your exact property location on the map
                    </h4>
                  </div>
                  <p className="text-[#616161] text-[12px]">
                    Make it clear to potential customers where your location is.
                    We won’t show your exact property location unless you give
                    us permission to do so.
                  </p>
                </div>
                {showAddress && (
                  <div className="">
                    <div className="mb-7">
                      <p className={"mb-2"}>House number</p>
                      <TextInput value={formik.values.housenumber} disabled />
                    </div>
                    <div className="mb-7">
                      <p className={"mb-2"}>Street</p>
                      <TextInput value={formik.values.street} disabled />
                    </div>
                    <div className="mb-7">
                      <p className={"mb-2"}>City</p>
                      <TextInput value={formik.values.city} disabled />
                    </div>
                    <div className="mb-7">
                      <p className={"mb-2"}>Administrative area</p>
                      <TextInput
                        value={formik.values.administrativeArea}
                        disabled
                      />
                    </div>
                    <div className="mb-7">
                      <p className={"mb-2"}>Postal Code</p>
                      <TextInput value={formik.values.postalCode} disabled />
                    </div>
                    <div className="mb-7">
                      <p className={"mb-2"}>Latitude</p>
                      <TextInput value={formik.values.latitude} disabled />
                    </div>
                    <div className="mb-7">
                      <p className={"mb-2"}>Longitude</p>
                      <TextInput value={formik.values.longitude} disabled />
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
                  <Select
                    id="currency"
                    onBlur={formik.handleBlur("currency")}
                    onValueChange={(e) =>
                      formik.setFieldValue("currency", e, true)
                    }
                    className={"text-sm"}
                    value={formik.values.currency}
                  >
                    {CURRENCIES.map((item, index) => (
                      <SelectItem value={item} key={index}>
                        {item}
                      </SelectItem>
                    ))}
                  </Select>
                  {showError && formik.errors.currency && (
                    <FormHelperText error>
                      {formik.errors.currency}
                    </FormHelperText>
                  )}
                </div>
                <div className="mb-14">
                  <p className={"mb-2"}>Type your price</p>
                  <NumberInput
                    placeholder="$ 0.00"
                    enableStepper={false}
                    name="price"
                    id="price"
                    min={0}
                    onValueChange={(e) =>
                      formik.setFieldValue("price", e, true)
                    }
                    value={formik.values.price}
                    onBlur={formik.handleBlur}
                    error={!!formik.errors.price && showError}
                  />
                  {formik.touched.price && formik.errors.price && (
                    <FormHelperText error>{formik.errors.price}</FormHelperText>
                  )}
                </div>
                <Button
                  className="w-[247px] h-[56px] mt-8 border border-[#2C72F6]"
                  onClick={async () => {
                    const errors = validateStep1(formik.values);
                    formik.setErrors(errors);
                    if (Object.keys(errors).length === 0) {
                      handleNext();
                    } else {
                      setShowErros(true);
                    }
                  }}
                  // onClick={handleNext}
                  // disabled={!formik.values.currency || !formik.values.price}
                >
                  Next
                  <Icon
                    className="text-white align-middle"
                    icon={ArrowSmallRightIcon}
                  />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default GeneralInfo;
