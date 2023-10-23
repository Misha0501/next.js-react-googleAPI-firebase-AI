import React, { useState } from "react";
import StepsTopInfo from "./StepsTopInfo";
import property1 from "@/public/property1.png";
import { Button, Divider } from "@tremor/react";
import { ArrowSmallRightIcon } from "@heroicons/react/24/solid";

import { ListingImage } from "@/types";
import { PlacingPropertyImagesHandler } from "@/app/components/PlacingPropertyImagesHandler";
import { useGenerateDescription } from "@/providers/GenerateDescription";
import { FormikProps } from "formik";

interface CreatePropertyComponentPropInterface {
  formik: FormikProps<any>;
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
  const generate = useGenerateDescription();

  const handleImagesChange = (images: ListingImage[]) => {
    formik.setFieldValue("images", images, true);
  };

  const generateDescription = async () => {
    const generatedDescription = await generate.mutateAsync({
      listingType: formik.values.listingType || null,
      propertyType: formik.values.propertyType || null,
      interiorType: formik.values.interiorType || null,
      currency: formik.values.currency,
      price: formik.values.price,
      rooms: formik.values.rooms,
      bathrooms: formik.values.bathrooms,
      bedrooms: formik.values.bedrooms,
      floorNumber: formik.values.floorNumber,
      numberOfFloorsCommon: formik.values.numberOfFloorsCommon,
      heatingType: formik.values.heatingType || null,
      areaLand: formik.values.totalArea,
      areaLiving: formik.values.livingArea,
      areaTotal: formik.values.totalArea,
      upkeepType: formik.values.upkeepType || null,
      yearBuilt: formik.values.yearBuilt,
      buildingType: formik.values.buildingType || null,
      outsideArea: formik.values.outsideArea,
      garage: formik.values.garage,
      garden: formik.values.garden,
    });

    await formik.setFieldValue("description", generatedDescription, true);
  };

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
                <p className={"text-md font-light text-[#616161] text-sm"}>
                  Let us help you with that and generate a description for you. Just click the button below. <br />
                  It can take up to 30 seconds.
                </p>
                <Button
                  loading={generate.isLoading}
                  type="button"
                  variant={"secondary"}
                  onClick={generateDescription}
                >
                  Generate
                </Button>

                {/* Show error message */}
                {generate.isError && (
                  <div className="text-red-500">
                    Oops! Something went wrong. Please try generating again later.
                  </div>
                )}

                <textarea
                  disabled={generate.isLoading}
                  onChange={(e) => {
                    formik.setFieldValue("description", e.target.value);
                  }}
                  value={formik.values.description}
                  name="description"
                  id="description"
                  placeholder="Type your description here"
                  className={
                    "border-2 border-[#97B6FF] rounded-md max-w-[676px] outline-0 min-h-[150px] p-3 text-gray-500 text-md"
                  }
                />
              </div>
            </div>
            <Divider className={"my-8 md:my-14"} />
            <div className="grid md:grid-cols-2 gap-8 md:gap-16">
              <div></div>
              <div className="flex items-center flex-wrap justify-between gap-4">
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
                  onClick={handleNext}
                  loading={generate.isLoading}
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
}

export default DescriptionAndImages;
