import StepsTopInfo from "./StepsTopInfo";
import property1 from "@/public/property1.png";
import {
  Button,
  Divider,
  Icon,
  NumberInput,
  Select,
  SelectItem,
} from "@tremor/react";
import { useState } from "react";
import {
  ArrowSmallRightIcon,
  ArrowSmallLeftIcon,
} from "@heroicons/react/24/solid";
import {
  BUILDING_TYPE,
  CHARACTERISTICS,
  HEATING_TYPES,
  INTERIOR_TYPES,
  UPKEEP_TYPES,
} from "@/app/Constants";
import SingleSelectRadioButton from "../SingleSelectRadioButton";
import MultiSelectRadioButton from "../MultiSelectRadioButton";
import { FormHelperText } from "@mui/material";

const MoreDetails = (props: any) => {
  const { formik, handleBack, step, handleNext, isShow } = props;
  const [show, setShow] = useState(true);
  const [showError, setShowErros] = useState(false);
  const title = "Tell Us More About Your Property";
  const stepNumber = "Step 2";

  const check = (e) => {
    event?.preventDefault();
    let errors: any = {};
    if (!formik.values.rooms && formik.values.propertyType !== "LAND") {
      errors.rooms = "Required";
    }
    if (!formik.values.bedrooms && formik.values.propertyType !== "LAND") {
      errors.bedrooms = "Required";
    }
    if (!formik.values.bathrooms && formik.values.propertyType !== "LAND") {
      errors.bathrooms = "Required";
    }
    if (!formik.values.interiortype && formik.values.propertyType !== "LAND") {
      errors.interiortype = "Required";
    }
    if (!formik.values.upkeeptype && formik.values.propertyType !== "LAND") {
      errors.upkeeptype = "Required";
    }
    if (!formik.values.heatingtype && formik.values.propertyType !== "LAND") {
      errors.heatingtype = "Required";
    }
    if (!formik.values.yearBuilt && formik.values.propertyType !== "LAND") {
      errors.yearBuilt = "Required";
    }
    if (
      !formik.values.numberOfFloorsCommon &&
      formik.values.propertyType !== "LAND"
    ) {
      errors.numberOfFloorsCommon = "Required";
    }
    if (!formik.values.floorNumber && formik.values.propertyType !== "LAND") {
      errors.floorNumber = "Required";
    }
    if (!formik.values.buildingtype && formik.values.propertyType !== "LAND") {
      errors.buildingtype = "Required";
    }
    if (!formik.values.totalarea) {
      errors.totalarea = "Required";
    }
    if (!formik.values.livingarea && formik.values.propertyType !== "LAND") {
      errors.livingarea = "Required";
    }
    if (!formik.values.outsidearea && formik.values.propertyType !== "LAND") {
      errors.outsidearea = "Required";
    }
    if (!formik.values.garden && formik.values.propertyType !== "LAND") {
      errors.garden = "Required";
    }
    if (!formik.values.garage && formik.values.propertyType !== "LAND") {
      errors.garage = "Required";
    }
    if (!formik.values.volume && formik.values.propertyType !== "LAND") {
      errors.volume = "Required";
    }
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
            {formik.values.propertyType === "LAND" ? null : (
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
            {formik.values.propertyType === "LAND" ? null : (
              <>
                <Divider className={"my-8 md:my-14"} />
                <div className="grid md:grid-cols-2 gap-8 md:gap-16">
                  <p className={"text-2xl font-bold"}>
                    Does your property has one or more of the below
                    characteristics?
                  </p>
                  <div className="">
                    <p className="mb-2">You can select multiple items</p>
                    <MultiSelectRadioButton
                      value={formik.values.characteristics}
                      options={CHARACTERISTICS}
                      onChange={(e) =>
                        formik.setFieldValue("characteristics", e, true)
                      }
                      id="characteristics"
                    />
                  </div>
                </div>
              </>
            )}
            <Divider />
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
                        name="totalarea"
                        id="totalarea"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={showError && !!formik.errors.totalarea}
                        value={formik.values.totalarea}
                      />
                      m2
                    </div>
                  </div>
                </div>
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
                        name="livingarea"
                        id="livingarea"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={showError && !!formik.errors.livingarea}
                        value={formik.values.livingarea}
                      />
                      m2
                    </div>
                  </div>
                  {/* {showError && formik.errors.livingarea && (
                    <FormHelperText className="flex justify-end" error>
                      {formik.errors.livingarea}
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
                        name="outsidearea"
                        id="outsidearea"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={showError && !!formik.errors.outsidearea}
                        value={formik.values.outsidearea}
                      />
                      m2
                    </div>
                  </div>
                  {/* {showError && formik.errors.outsidearea && (
                    <FormHelperText className="flex justify-end" error>
                      {formik.errors.outsidearea}
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
                      onBlur={formik.onBlur}
                      value={formik.values.interiortype}
                      options={INTERIOR_TYPES}
                      onChange={(e) =>
                        formik.setFieldValue("interiortype", e, true)
                      }
                      id="interiortype"
                    />
                    {formik.errors.interiortype && showError && (
                      <FormHelperText error>
                        {formik.errors.interiortype}
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
                      value={formik.values.upkeeptype}
                      options={UPKEEP_TYPES}
                      onChange={(e) =>
                        formik.setFieldValue("upkeeptype", e, true)
                      }
                      id="upkeeptype"
                    />
                    {formik.errors.upkeeptype && showError && (
                      <FormHelperText error>
                        {formik.errors.upkeeptype}
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
                      value={formik.values.heatingtype}
                      options={HEATING_TYPES}
                      onChange={(e) =>
                        formik.setFieldValue("heatingtype", e, true)
                      }
                      id="heatingtype"
                    />
                    {formik.errors.heatingtype && showError && (
                      <FormHelperText error>
                        {formik.errors.heatingtype}
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
                    <div className="py-6">
                      <p className={"font-bold mb-2"}>Building type</p>
                      <div>
                        <Select
                          onBlur={formik.handleBlur}
                          id="buildingtype"
                          onChange={(e) =>
                            formik.setFieldValue("buildingtype", e, true)
                          }
                          className={"text-sm"}
                          value={formik.values.buildingtype}
                        >
                          {BUILDING_TYPE.map((item, index) => (
                            <SelectItem value={item} key={index}>
                              {item}
                            </SelectItem>
                          ))}
                        </Select>
                        {showError && formik.errors.buildingtype && (
                          <FormHelperText error>
                            {formik.errors.buildingtype}
                          </FormHelperText>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
            <div className="flex items-center justify-between">
              <Button
                onClick={handleBack}
                variant="secondary"
                className="w-[247px] h-[56px] mt-20 border  border-[#2C72F6]"
              >
                <Icon
                  className="text-[#2C72F6] align-middle"
                  icon={ArrowSmallLeftIcon}
                />
                Back
              </Button>
              <Button
                className="w-[247px] h-[56px] mt-20 border border-[#2C72F6]"
                // onClick={check}
                onClick={async () => {
                  const errors = check(formik.values);
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
