import StepsTopInfo from "./StepsTopInfo";
import property1 from "@/public/property1.png";
import { Button, Divider, NumberInput } from "@tremor/react";
import { useState } from "react";
import { ArrowSmallRightIcon } from "@heroicons/react/24/solid";
import {
  HEATING_TYPES,
  INTERIOR_TYPES,
  UPKEEP_TYPES,
} from "../../lib/constants";
import SingleSelectRadioButton from "./SingleSelectRadioButton";
import { FormHelperText } from "@mui/material";
import { FormikProps } from "formik";

interface CreatePropertyComponentPropInterface {
  formik: any;
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
  const [show, setShow] = useState(true);
  const [showError, setShowErros] = useState(false);
  const title = "Tell Us More About Your Property";
  const stepNumber = "Step 2";

  const check = () => {
    event?.preventDefault();
    let errors: any = {};
    if (!formik.values.interiorType && formik.values.propertyType !== "LAND") {
      errors.interiorType = "Required";
    }
    if (!formik.values.upkeepType && formik.values.propertyType !== "LAND") {
      errors.upkeepType = "Required";
    }
    if (!formik.values.heatingType && formik.values.propertyType !== "LAND") {
      errors.heatingType = "Required";
    }
    if (!formik.values.totalArea) {
      errors.totalArea = "Required";
    }
    return errors;
  };

  const tenYearsFromNow = new Date().getFullYear() + 10

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
                    Basic information
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
                    <div className="py-6 border-b">
                      <div className="flex justify-between items-center">
                        <span>Parking places</span>
                        <NumberInput
                          placeholder="0"
                          className={"w-min"}
                          name="parking"
                          id="parking"
                          onValueChange={(e) =>
                            formik.setFieldValue("parking", e, true)
                          }
                          error={!!formik.errors.parking && showError}
                          value={formik.values.parking}
                          onBlur={formik.handleBlur}
                        />
                      </div>
                      {formik.touched.parking && formik.errors.parking && (
                        <FormHelperText error>
                          {formik.errors.parking}
                        </FormHelperText>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
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
                            name="areaOutside"
                            id="areaOutside"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={showError && !!formik.errors.areaOutside}
                            value={formik.values.areaOutside}
                          />
                          m2
                        </div>
                      </div>
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
                            name="areaGarage"
                            id="areaGarage"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={showError && !!formik.errors.areaGarage}
                            value={formik.values.areaGarage}
                          />
                          m2
                        </div>
                      </div>
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
                          min={1900}
                          max={tenYearsFromNow}
                          onBlur={formik.handleBlur}
                          name="constructedYear"
                          id="constructedYear"
                          onValueChange={(e) =>
                            formik.setFieldValue("constructedYear", e, true)
                          }
                          error={showError && !!formik.errors.constructedYear}
                          value={formik.values.constructedYear}
                        />
                      </div>
                      {showError && formik.errors.constructedYear && (
                        <FormHelperText className="flex justify-end" error>
                          {formik.errors.constructedYear}
                        </FormHelperText>
                      )}
                    </div>
                    <div className="py-6 border-b">
                      <div className="flex justify-between items-center">
                        <span>Floors in the building</span>
                        <NumberInput
                          className={"w-min "}
                          min={0}
                          name="numberOfFloorsCommon"
                          id="numberOfFloorsCommon"
                          onBlur={formik.handleBlur}
                          onValueChange={(e) =>
                            formik.setFieldValue(
                              "numberOfFloorsCommon",
                              e,
                              true,
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
                          min={0}
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
                  </div>
                </div>
              </>
            )}
            <div className="grid md:grid-cols-2 gap-8 md:gap-16">
              <div></div>
              <div className="flex items-center flex-wrap justify-between gap-4 mt-10">
                <Button
                  onClick={handleBack}
                  variant="secondary"
                  size={"xl"}
                  className="w-full lg:max-w-[250px]"
                >
                  Back
                </Button>
                <Button
                  className="w-full lg:max-w-[250px]"
                  icon={ArrowSmallRightIcon}
                  size={"xl"}
                  iconPosition={"right"}
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

export default MoreDetails;
