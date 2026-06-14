"use client";
import { ArrowSmallRightIcon } from "@heroicons/react/24/solid";
import {
  Button,
  Divider,
  Select,
  SelectItem,
  TextInput,
} from "@tremor/react";
import property1 from "@/public/property1.png";
import StepsTopInfo from "./StepsTopInfo";
import { LISTING_TYPES, PROPERTY_TYPES } from "../../lib/constants";
import React, { useState } from "react";
import PropertyPlacementRadioButtons from "./PropertyPlacementRadioButtons";
import { FormHelperText } from "@mui/material";
import { AutocompleteAddress } from "@/types";
import { AddressAutocomplete } from "@/app/components/propertyPlacementEdit/AddressAutocomplete";

interface CreatePropertyComponentPropInterface {
  formik: any;
  handleNext: () => void;
  step: number;
  isShow: boolean;
}

const GeneralInfo = ({
  formik,
  handleNext,
  step,
  isShow,
}: CreatePropertyComponentPropInterface) => {

  const [show, setShow] = useState(true);
  const [showError, setShowErros] = useState(false);
  const [priceDisplay, setPriceDisplay] = useState(
    formik.values.price ? new Intl.NumberFormat("bg-BG").format(Number(formik.values.price)) : ""
  );

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "");
    if (!digits) {
      setPriceDisplay("");
      formik.setFieldValue("price", "", true);
      return;
    }
    const num = parseInt(digits, 10);
    setPriceDisplay(new Intl.NumberFormat("bg-BG").format(num));
    formik.setFieldValue("price", num, true);
  };
  const [showAddress, setShowAddress] = useState(
    formik.values.route ||
      Boolean(
        formik.values.administrativeArea ||
          formik.values.locality ||
          formik.values.streetNumber ||
          formik.values.postalCode ||
          formik.values.latitude ||
          formik.values.longitude
      )
  );
  const title = "Add essential information about your property";
  const stepNumber = "Step 1";

  const handleAddressChange = (address: AutocompleteAddress) => {
    if (address) {
      formik.setFieldValue("route", address.route);
      formik.setFieldValue("neighborhood", address.neighborhood);
      formik.setFieldValue("streetNumber", address.streetNumber);
      formik.setFieldValue("locality", address.locality);
      formik.setFieldValue("administrativeArea", address.administrativeAreaLevelOne);
      formik.setFieldValue("postalCode", address.postalCode);
      formik.setFieldValue("latitude", address.latitude);
      formik.setFieldValue("longitude", address.longitude);
      setShowAddress(true);
      formik.setFieldError("locality", undefined);
    }
  };

  const validateStep1 = () => {
    event?.preventDefault();
    const errors: any = {};
    if (!formik.values.listingType) errors.listingType = "Required";
    if (!formik.values.propertyType) errors.propertyType = "Required";
    if (!formik.values.locality) errors.locality = "Please select an address from the suggestions";
    if (!formik.values.price) errors.price = "Required";
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 py-10 w-full gap-0 md:gap-20 items-center">
              <div>
                <p className="text-[18px] text-[#222]">{stepNumber}</p>
                <h4
                  className="text-[24px] md:text-[40px] font-bold py-10"
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
                {showError && formik.errors.listingType && (
                  <FormHelperText error>
                    {formik?.errors?.listingType}
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
                  <AddressAutocomplete onAddressChange={handleAddressChange} />
                  {showError && formik.errors.locality && (
                    <FormHelperText error>{formik.errors.locality}</FormHelperText>
                  )}
                </div>
                {showAddress && (
                  <div className="">
                    <div className="mb-7">
                      <p className={"mb-2"}>House number</p>
                      <TextInput value={formik.values.streetNumber} disabled />
                    </div>
                    <div className="mb-7">
                      <p className={"mb-2"}>Street</p>
                      <TextInput value={formik.values.route} disabled />
                    </div>
                    <div className="mb-7">
                      <p className={"mb-2"}>Neighborhood</p>
                      <TextInput value={formik.values.neighborhood} disabled />
                    </div>
                    <div className="mb-7">
                      <p className={"mb-2"}>City</p>
                      <TextInput value={formik.values.locality} disabled />
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
                  </div>
                )}
              </div>
            </div>
            <Divider className={"my-8 md:my-14"} />
            <div className="grid md:grid-cols-2 gap-8 md:gap-16">
              <p className={"text-2xl font-bold"}>What is your asking price</p>
              <div className="">
                <div className="mb-14">
                  <p className={"mb-2"}>Type your price</p>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-gray-500 text-sm pointer-events-none select-none font-medium">€</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      id="price"
                      name="price"
                      placeholder="0"
                      value={priceDisplay}
                      onChange={handlePriceChange}
                      onBlur={formik.handleBlur("price")}
                      className="w-full pl-7 pr-3 py-2 text-sm rounded-md border border-gray-200 bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition"
                    />
                  </div>
                  {(showError || formik.touched.price) && formik.errors.price && (
                    <FormHelperText error>{formik.errors.price}</FormHelperText>
                  )}
                </div>
                <Button
                  className="min-w-[250px]"
                  icon={ArrowSmallRightIcon}
                  size={"xl"}
                  iconPosition={"right"}
                  onClick={async () => {
                    const errors = validateStep1();
                    formik.setErrors(errors);
                    if (Object.keys(errors).length === 0) {
                      handleNext();
                    } else {
                      setShowErros(true);
                    }
                  }}
                >
                  Next
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
