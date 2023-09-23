import React, { useEffect, useState } from "react";
import StepsTopInfo from "./StepsTopInfo";
import property1 from "@/public/property1.png";
import { Button, Divider, Icon, TextInput } from "@tremor/react";
import {
  ArrowSmallRightIcon,
  ArrowSmallLeftIcon,
} from "@heroicons/react/24/solid";

import { ListingImage } from "@/types";
import { PlacingPropertyImagesHandler } from "@/app/components/PlacingPropertyImagesHandler";
import { useGenerateDescription } from "@/providers/GenerateDescription";
import { CreatePropertyFormikPropInterface } from "@/app/Constants";
import { FormikProps } from "formik";

interface CreatePropertyComponentPropInterface {
  formik: FormikProps<CreatePropertyFormikPropInterface>;
  handleNext: () => void;
  handleBack: () => void;
  step: number;
  isShow: boolean;
}

function DescriptionAndImages({
  formik,
  handleBack,
  step,
  handleNext,
  isShow,
}: CreatePropertyComponentPropInterface) {
  // const { formik, handleBack, step, handleNext, isShow } = props;
  const [show, setShow] = useState(true);
  const [textAreaWordCount, setTextAreaWordCount] = useState(0);
  const [noOfHighlights, setNoOfHighlights] = useState(0);
  const generate = useGenerateDescription();

  const handleTextAreaChange = (event: any) => {
    const text = event.target.value;
    // Split the text by spaces to count words
    const words = text.trim().split(/\s+/);
    // Update the word count in the state
    setTextAreaWordCount(words.length);
  };

  const handleImagesChange = (images: ListingImage[]) => {
    formik.setFieldValue("images", images, true);
  };

  const generateDescription = () => {
    generate.mutate({
      listingType: formik.values.listingType || null,
      propertyType: formik.values.propertyType || null,
      interiorType: formik.values.interiortype || null,
      currency: formik.values.currency,
      price: formik.values.price,
      rooms: formik.values.rooms,
      bathrooms: formik.values.bathrooms,
      bedrooms: formik.values.bedrooms,
      // parking: formik.values.parking,      // Redundant One
      floorNumber: formik.values.floorNumber,
      // numberOfFloorsProperty: formik.values.numberOfFloorsProperty,      // Redundant One
      numberOfFloorsCommon: formik.values.numberOfFloorsCommon,
      heatingType: formik.values.heatingtype || null,
      areaLand: formik.values.totalarea,
      areaLiving: formik.values.livingarea,
      areaTotal: formik.values.totalarea,
      upkeepType: formik.values.upkeeptype || null,
      yearBuilt: formik.values.yearBuilt,
      buildingType: formik.values.buildingtype || null,
      outsideArea: formik.values.outsidearea,
      garage: formik.values.garage,
      garden: formik.values.garden,
    });
  };

  useEffect(() => {
    if (generate.isSuccess) {
      formik.setFieldValue("discription", generate?.data, true);
    }
  }, [generate.isSuccess]);

  const stepNumber = "Step 3";
  const title = "Make your space stand out!";
  const description =
    "In this step we will ask you information about your intention whether you’re renting or selling a property. We will also acquire information about your property, its type, location, specifics and special characteristics.";
  return (
    <>
      <div className="max-w-screen-xl m-auto">
        {isShow && show ? (
          <StepsTopInfo
            stepNumber={stepNumber}
            title={title}
            description={description}
            imageSrc={property1}
            step={step}
            handleBack={handleBack}
            onClick={() => setShow(false)}
          />
        ) : (
          <div className="container">
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
              <div>
                <p className={"text-2xl font-bold"}>
                  Upload at least 3 pictures <br /> of your property
                </p>
              </div>
              <div className="grid gap-6">
                {/*<p>You can drag and drop images to change the order</p>*/}
                <PlacingPropertyImagesHandler
                  initialImages={formik.values.images || []}
                  onChange={handleImagesChange}
                />
              </div>
            </div>
            <Divider className={"my-8 md:my-14"} />
            <div className="grid md:grid-cols-2 gap-8 md:gap-16">
              <p className={"text-2xl font-bold"}>
                Write description about your <br />
                property
              </p>
              <div className="flex flex-col gap-4">
                <p className={"text-md font-bold"}>Description</p>
                <p className={"text-md font-light text-[#616161]"}>
                  Share what&apos;s special about your space.
                </p>
                <Button
                  disabled={generate.isLoading}
                  type="button"
                  onClick={generateDescription}
                >
                  Generate
                </Button>
                <textarea
                  disabled={generate.isLoading}
                  onChange={(e) => {
                    setTextAreaWordCount(e.target.value.length);
                    formik.setFieldValue("discription", e.target.value);
                  }}
                  // maxLength={4000}
                  value={formik.values.discription}
                  name="discription"
                  id="discription"
                  placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sapien ornare vitae amet."
                  className={
                    "border-2 border-[#97B6FF] rounded-md max-w-[676px] outline-0 min-h-[150px] p-3 text-gray-500 text-md"
                  }
                />

                {/* <TextInput
                  disabled={generate.isLoading}
                  max={1000}
                  style={{ height: "200px" }}
                  multiple
                  name="discription"
                  id="discription"
                  onChange={formik.handleChange}
                  error={Boolean(
                    formik.touched.discription && formik.errors.discription
                  )}
                  value={formik.values.discription}
                /> */}
                {/*<p className={"text-xs font-normal text-[#222222]"}>*/}
                {/*  {textAreaWordCount}/4000*/}
                {/*</p>*/}
              </div>
            </div>

            <Divider className={"my-8 md:my-14"} />
            <div className="grid md:grid-cols-2 gap-8 md:gap-16 mb-6">
              {/* <p className={"text-2xl font-bold"}>Highlights</p> */}
            </div>
            <div className="flex items-center justify-between ">
              {/* <div className="flex flex-col gap-5">
                  <p className={"text-md font-light text-[#616161]"}>
                    Share max two points that should be highlighted in your
                    property.
                  </p>
                  {noOfHighlights > 0 && (
                    <div className="mb-8">
                      {noOfHighlights >= 1 && <AddHighlightComponent />}
                      {noOfHighlights >= 2 && <AddHighlightComponent />}
                    </div>
                  )}

                  <Button
                    onClick={() => setNoOfHighlights(noOfHighlights + 1)}
                    disabled={noOfHighlights >= 2}
                    className={
                      "bg-transparent max-w-[676px] border-2 text-[#4785FD] border-[#4785FD]  font-semibold py-3 px-4  rounded-md disabled:text-[#8daae3] disabled:border-[#8daae3]"
                    }
                  >
                    Add highlights
                    <Icon className="text-[#4785FD]" icon={PlusIcon} />
                  </Button>
                </div> */}
              <Button
                className="w-[247px] h-[56px] mt-8 border border-[#2C72F6]"
                onClick={handleBack}
                variant="secondary"
              >
                <Icon
                  className="text-[#2C72F6] align-middle"
                  icon={ArrowSmallLeftIcon}
                />
                Back
              </Button>
              <Button
                className="w-[247px] h-[56px] mt-8 border border-[#2C72F6]"
                onClick={handleNext}
              >
                Next
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
}

export default DescriptionAndImages;
