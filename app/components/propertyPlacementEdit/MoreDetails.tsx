import StepsTopInfo from "./StepsTopInfo";
import property1 from "@/public/property1.png";
import { Button, Divider, Icon, NumberInput } from "@tremor/react";
import { useState } from "react";
import {
  ArrowSmallLeftIcon,
  ArrowSmallRightIcon,
} from "@heroicons/react/24/solid";
import {
  CreatePropertyFormikPropInterface,
  HEATING_TYPES,
  INTERIOR_TYPES,
  UPKEEP_TYPES,
} from "../../lib/constants";
import SingleSelectRadioButton from "../SingleSelectRadioButton";
import { FormHelperText } from "@mui/material";
import { FormikProps } from "formik";

interface CreatePropertyComponentPropInterface {
  formik: FormikProps<CreatePropertyFormikPropInterface>;
  handleNext: () => void;
  handleBack: () => void;
  step: number;
  isShow: boolean;
}

const MoreDetails = ({
  formik,
  handleBack,
  step,
  handleNext,
  isShow,
}: CreatePropertyComponentPropInterface) => {
  // const { formik, handleBack, step, handleNext, isShow } = props;
  const [show, setShow] = useState(true);
  const [showError, setShowErros] = useState(false);
  const title = "Tell Us More About Your Property";
  const stepNumber = "Step 2";

  const check = () => {
    event?.preventDefault();
    let errors: any = {};
    // if (!formik.values.rooms && formik.values.propertyType !== "LAND") {
    //   errors.rooms = "Required";
    // }
    // if (!formik.values.bedrooms && formik.values.propertyType !== "LAND") {
    //   errors.bedrooms = "Required";
    // }
    // if (!formik.values.bathrooms && formik.values.propertyType !== "LAND") {
    //   errors.bathrooms = "Required";
    // }
    if (!formik.values.interiorType && formik.values.propertyType !== "LAND") {
      errors.interiorType = "Required";
    }
    if (!formik.values.upkeepType && formik.values.propertyType !== "LAND") {
      errors.upkeepType = "Required";
    }
    if (!formik.values.heatingType && formik.values.propertyType !== "LAND") {
      errors.heatingType = "Required";
    }
    // if (!formik.values.yearBuilt && formik.values.propertyType !== "LAND") {
    //   errors.yearBuilt = "Required";
    // }
    // if (
    //   !formik.values.numberOfFloorsCommon &&
    //   formik.values.propertyType !== "LAND"
    // ) {
    //   errors.numberOfFloorsCommon = "Required";
    // }
    // if (!formik.values.floorNumber && formik.values.propertyType !== "LAND") {
    //   errors.floorNumber = "Required";
    // }
    // if (!formik.values.buildingType && formik.values.propertyType !== "LAND") {
    //   errors.buildingType = "Required";
    // }
    if (!formik.values.totalArea) {
      errors.totalArea = "Required";
    }
    // if (!formik.values.livingArea && formik.values.propertyType !== "LAND") {
    //   errors.livingArea = "Required";
    // }
    // if (!formik.values.outsideArea && formik.values.propertyType !== "LAND") {
    //   errors.outsideArea = "Required";
    // }
    // if (!formik.values.garden && formik.values.propertyType !== "LAND") {
    //   errors.garden = "Required";
    // }
    // if (!formik.values.garage && formik.values.propertyType !== "LAND") {
    //   errors.garage = "Required";
    // }
    // if (!formik.values.volume && formik.values.propertyType !== "LAND") {
    //   errors.volume = "Required";
    // }
    return errors;
  };

  return (
    <>
      <div className="max-w-screen-xl m-auto">
        {show && isShow ? (
          <StepsTopInfo
            stepNumber={stepNumber}
            title={title}
            description="In this section, we dive deeper into your property details. Provide specifics such as property type, location, features, and any unique characteristics that make your property stand out. Your input helps us create a compelling listing that attracts potential buyers or lessees."
            imageSrc={property1}
            step={step}
            handleBack={() => {
              handleBack();
            }}
            onClick={() => setShow(false)}
          />
        ) : (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 py-10 w-full gap-0 md:gap-20  items-center">
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
            {formik.values.propertyType !== "LAND" && (
              <>
                <Divider />
                <div className="grid md:grid-cols-2 gap-8 md:gap-16">
                  <p className={"text-2xl font-bold"}>
                    What is the number of rooms
                  </p>
                  <div className="">
                    <div className="pb-8 border-b">
                      <div className="flex justify-between items-center">
                        <span>Rooms</span>
                        <NumberInput
                          placeholder="0"
                          className={"w-min"}
                          name="rooms"
                          id="rooms"
                          min={0}
                          onValueChange={(e) =>
                            formik.setFieldValue("rooms", e, true)
                          }
                          onBlur={formik.handleBlur("rooms")}
                          error={!!formik.errors.rooms && showError}
                          value={formik.values.rooms}
                        />
                      </div>
                      {formik.touched.rooms && formik.errors.rooms && (
                        <FormHelperText error>
                          {formik.errors.rooms}
                        </FormHelperText>
                      )}
                    </div>
                    <div className="py-6 border-b">
                      <div className="flex justify-between items-center">
                        <span>Bedrooms</span>
                        <NumberInput
                          placeholder="0"
                          className={"w-min"}
                          name="bedrooms"
                          id="bedrooms"
                          min={0}
                          onValueChange={(e) =>
                            formik.setFieldValue("bedrooms", e, true)
                          }
                          error={!!formik.errors.bedrooms && showError}
                          value={formik.values.bedrooms}
                          onBlur={formik.handleBlur("bedrooms")}
                        />
                      </div>
                      {formik.touched.bedrooms && formik.errors.bedrooms && (
                        <FormHelperText error>
                          {formik.errors.bedrooms}
                        </FormHelperText>
                      )}
                    </div>
                    <div className="py-6 border-b">
                      <div className="flex justify-between items-center">
                        <span>Bathrooms</span>
                        <NumberInput
                          placeholder="0"
                          className={"w-min"}
                          name="bathrooms"
                          id="bathrooms"
                          onValueChange={(e) =>
                            formik.setFieldValue("bathrooms", e, true)
                          }
                          error={!!formik.errors.bathrooms && showError}
                          value={formik.values.bathrooms}
                          onBlur={formik.handleBlur}
                        />
                      </div>
                      {formik.touched.bathrooms && formik.errors.bathrooms && (
                        <FormHelperText error>
                          {formik.errors.bathrooms}
                        </FormHelperText>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
            {/*{formik.values.propertyType === "LAND" ? null : (*/}
            {/*  <>*/}
            {/*    <Divider className={"my-8 md:my-14"} />*/}
            {/*    <div className="grid md:grid-cols-2 gap-8 md:gap-16">*/}
            {/*      <p className={"text-2xl font-bold"}>*/}
            {/*        Does your property has one or more of the below*/}
            {/*        characteristics?*/}
            {/*      </p>*/}
            {/*      <div className="">*/}
            {/*        <p className="mb-2">You can select multiple items</p>*/}
            {/*        <MultiSelectRadioButton*/}
            {/*          value={formik.values.characteristics}*/}
            {/*          options={CHARACTERISTICS}*/}
            {/*          onChange={(e) =>*/}
            {/*            formik.setFieldValue("characteristics", e, true)*/}
            {/*          }*/}
            {/*          id="characteristics"*/}
            {/*        />*/}
            {/*      </div>*/}
            {/*    </div>*/}
            {/*  </>*/}
            {/*)}*/}
            <Divider className={"my-8 md:my-14"} />
            <div className="grid md:grid-cols-2 gap-8 md:gap-16">
              <p className={"text-2xl font-bold"}>
                Specify property dimensions
              </p>
              <div className="">
                <div className="pb-8">
                  <div className="flex justify-between items-center">
                    <span>Total area</span>
                    <div className="flex items-center gap-2">
                      <NumberInput
                        placeholder="0"
                        enableStepper={false}
                        className={"w-min "}
                        min={0}
                        name="totalArea"
                        id="totalArea"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={showError && !!formik.errors.totalArea}
                        value={formik.values.totalArea}
                      />
                      m2
                    </div>
                  </div>
                </div>
                {formik.values.propertyType !== "LAND" && (
                  <>
                    <Divider />
                    <div className="py-6">
                      <div className="flex justify-between items-center">
                        <span>Living area</span>
                        <div className="flex items-center gap-2">
                          <NumberInput
                            placeholder="0"
                            enableStepper={false}
                            className={"w-min "}
                            min={0}
                            name="livingArea"
                            id="livingArea"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={showError && !!formik.errors.livingArea}
                            value={formik.values.livingArea}
                          />
                          m2
                        </div>
                      </div>
                      {/* {showError && formik.errors.livingArea && (
                    <FormHelperText className="flex justify-end" error>
                      {formik.errors.livingArea}
                    </FormHelperText>
                  )} */}
                    </div>
                    <Divider />
                    <div className="py-6">
                      <div className="flex justify-between items-center">
                        <span>Outside area</span>
                        <div className="flex items-center gap-2">
                          <NumberInput
                            enableStepper={false}
                            placeholder="0"
                            className={"w-min "}
                            min={0}
                            name="outsideArea"
                            id="outsideArea"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={showError && !!formik.errors.outsideArea}
                            value={formik.values.outsideArea}
                          />
                          m2
                        </div>
                      </div>
                      {/* {showError && formik.errors.outsideArea && (
                    <FormHelperText className="flex justify-end" error>
                      {formik.errors.outsideArea}
                    </FormHelperText>
                  )} */}
                    </div>
                    <Divider />
                    <div className="py-6">
                      <div className="flex justify-between items-center">
                        <span>Garden</span>
                        <div className="flex items-center gap-2">
                          <NumberInput
                            enableStepper={false}
                            placeholder="0"
                            className={"w-min "}
                            name="garden"
                            id="garden"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={showError && !!formik.errors.garden}
                            value={formik.values.garden}
                          />
                          m2
                        </div>
                      </div>
                      {/* {showError && formik.errors.garden && (
                    <FormHelperText className="flex justify-end" error>
                      {formik.errors.garden}
                    </FormHelperText>
                  )} */}
                    </div>
                    <Divider />
                    <div className="py-6">
                      <div className="flex justify-between items-center">
                        <span>Garage</span>
                        <div className="flex items-center gap-2">
                          <NumberInput
                            enableStepper={false}
                            placeholder="0"
                            className={"w-min "}
                            name="garage"
                            id="garage"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={showError && !!formik.errors.garage}
                            value={formik.values.garage}
                          />
                          m2
                        </div>
                      </div>
                      {/* {showError && formik.errors.garage && (
                    <FormHelperText className="flex justify-end" error>
                      {formik.errors.garage}
                    </FormHelperText>
                  )} */}
                    </div>
                    <Divider />
                    <div className="py-6">
                      <div className="flex justify-between items-center">
                        <span>Volume</span>
                        <div className="flex items-center gap-2">
                          <NumberInput
                            enableStepper={false}
                            placeholder="0"
                            className={"w-min "}
                            name="volume"
                            id="volume"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={showError && !!formik.errors.volume}
                            value={formik.values.volume}
                          />
                          m3
                        </div>
                      </div>
                      {/* {showError && formik.errors.volume && (
                    <FormHelperText className="flex justify-end" error>
                      {formik.errors.volume}
                    </FormHelperText>
                  )} */}
                    </div>
                    <Divider />
                  </>
                )}
              </div>
            </div>
            {formik.values.propertyType === "LAND" ? null : (
              <>
                <Divider className={"my-8 md:my-14"} />
                <div className="grid md:grid-cols-2 gap-8 md:gap-16">
                  <p className={"text-2xl font-bold"}>
                    What is the interior type
                  </p>
                  <div className="">
                    <SingleSelectRadioButton
                      onBlur={formik.handleBlur}
                      value={formik.values.interiorType}
                      options={INTERIOR_TYPES}
                      onChange={(e) =>
                        formik.setFieldValue("interiorType", e, true)
                      }
                      id="interiorType"
                    />
                    {formik.errors.interiorType && showError && (
                      <FormHelperText error>
                        {formik.errors.interiorType}
                      </FormHelperText>
                    )}
                  </div>
                </div>
              </>
            )}
            {formik.values.propertyType === "LAND" ? null : (
              <>
                <Divider className={"my-8 md:my-14"} />
                <div className="grid md:grid-cols-2 gap-8 md:gap-16">
                  <p className={"text-2xl font-bold"}>
                    What is the condition of the property
                  </p>
                  <div className="">
                    <SingleSelectRadioButton
                      value={formik.values.upkeepType}
                      options={UPKEEP_TYPES}
                      onChange={(e) =>
                        formik.setFieldValue("upkeepType", e, true)
                      }
                      id="upkeepType"
                    />
                    {formik.errors.upkeepType && showError && (
                      <FormHelperText error>
                        {formik.errors.upkeepType}
                      </FormHelperText>
                    )}
                  </div>
                </div>
              </>
            )}
            {formik.values.propertyType === "LAND" ? null : (
              <>
                <Divider className={"my-8 md:my-14"} />
                <div className="grid md:grid-cols-2 gap-8 md:gap-16">
                  <p className={"text-2xl font-bold"}>
                    What is the heating type of the property?
                  </p>
                  <div className="">
                    <SingleSelectRadioButton
                      value={formik.values.heatingType}
                      options={HEATING_TYPES}
                      onChange={(e) =>
                        formik.setFieldValue("heatingType", e, true)
                      }
                      id="heatingType"
                    />
                    {formik.errors.heatingType && showError && (
                      <FormHelperText error>
                        {formik.errors.heatingType}
                      </FormHelperText>
                    )}
                  </div>
                </div>
              </>
            )}
            {formik.values.propertyType === "LAND" ? null : (
              <>
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
                          className={"w-min "}
                          min={2010}
                          max={2040}
                          onBlur={formik.handleBlur}
                          name="yearBuilt"
                          id="yearBuilt"
                          onValueChange={(e) =>
                            formik.setFieldValue("yearBuilt", e, true)
                          }
                          error={showError && !!formik.errors.yearBuilt}
                          value={formik.values.yearBuilt}
                        />
                      </div>
                      {showError && formik.errors.yearBuilt && (
                        <FormHelperText className="flex justify-end" error>
                          {formik.errors.yearBuilt}
                        </FormHelperText>
                      )}
                    </div>
                    <div className="py-6 border-b">
                      <div className="flex justify-between items-center">
                        <span>Floors in the building</span>
                        <NumberInput
                          className={"w-min "}
                          name="numberOfFloorsCommon"
                          id="numberOfFloorsCommon"
                          onBlur={formik.handleBlur}
                          onValueChange={(e) =>
                            formik.setFieldValue(
                              "numberOfFloorsCommon",
                              e,
                              true
                            )
                          }
                          error={
                            showError && !!formik.errors.numberOfFloorsCommon
                          }
                          value={formik.values.numberOfFloorsCommon}
                        />
                      </div>
                      {showError && formik.errors.numberOfFloorsCommon && (
                        <FormHelperText className="flex justify-end" error>
                          {formik.errors.numberOfFloorsCommon}
                        </FormHelperText>
                      )}
                    </div>
                    <div className="py-6 border-b">
                      <div className="flex justify-between items-center">
                        <span>Apartment located at floor number</span>
                        <NumberInput
                          className={"w-min "}
                          name="floorNumber"
                          id="floorNumber"
                          onValueChange={(e) =>
                            formik.setFieldValue("floorNumber", e, true)
                          }
                          onBlur={formik.handleBlur}
                          error={showError && !!formik.errors.floorNumber}
                          value={formik.values.floorNumber}
                        />
                      </div>
                      {showError && formik.errors.floorNumber && (
                        <FormHelperText className="flex justify-end" error>
                          {formik.errors.floorNumber}
                        </FormHelperText>
                      )}
                    </div>
                    {/*<div className="py-6">*/}
                    {/*  <p className={"font-bold mb-2"}>Building type</p>*/}
                    {/*  <div>*/}
                    {/*    <Select*/}
                    {/*      onBlur={formik.handleBlur}*/}
                    {/*      id="buildingType"*/}
                    {/*      onChange={(e) =>*/}
                    {/*        formik.setFieldValue("buildingType", e, true)*/}
                    {/*      }*/}
                    {/*      className={"text-sm"}*/}
                    {/*      value={formik.values.buildingType}*/}
                    {/*    >*/}
                    {/*      {BUILDING_TYPE.map((item, index) => (*/}
                    {/*        <SelectItem value={item} key={index}>*/}
                    {/*          {item}*/}
                    {/*        </SelectItem>*/}
                    {/*      ))}*/}
                    {/*    </Select>*/}
                    {/*    {showError && formik.errors.buildingType && (*/}
                    {/*      <FormHelperText error>*/}
                    {/*        {formik.errors.buildingType}*/}
                    {/*      </FormHelperText>*/}
                    {/*    )}*/}
                    {/*  </div>*/}
                    {/*</div>*/}
                  </div>
                </div>
              </>
            )}
            <div className="flex items-center justify-between gap-2.5">
              <Button
                onClick={handleBack}
                variant="secondary"
                className="w-2/5 md:w-1/6 h-[56px] mt-20  border  border-[#2C72F6]"
              >
                <Icon
                  className="text-[#2C72F6] align-middle"
                  icon={ArrowSmallLeftIcon}
                />
                Back
              </Button>
              <Button
                className="w-3/5 md:w-1/6 h-[56px] mt-20 border border-[#2C72F6]"
                // onClick={check}
                onClick={async () => {
                  const errors = check();
                  formik.setErrors(errors);
                  if (Object.keys(errors).length === 0) {
                    handleNext();
                  } else {
                    setShowErros(true);
                  }
                }}
              >
                Next{" "}
                <Icon
                  className="text-white align-middle"
                  icon={ArrowSmallRightIcon}
                />
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MoreDetails;
