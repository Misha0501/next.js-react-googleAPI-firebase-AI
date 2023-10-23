import React from "react";
import { ArrowSmallRightIcon } from "@heroicons/react/24/solid";
import { Button } from "@tremor/react";
import Image, { StaticImageData } from "next/image";

interface StepsTopInfoProps {
  stepNumber?: string;
  title?: string;
  description?: string;
  imageSrc?: StaticImageData;
  onClick?: () => void;
  handleBack?: () => void;
  step?: any;
}

const StepsTopInfo: React.FC<StepsTopInfoProps> = ({
  stepNumber,
  title,
  description,
  imageSrc,
  step,
  onClick,
  handleBack,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 py-10 w-full gap-0 md:gap-20 align-middle">
      <div>
        <p className="text-[18px] text-[#222]">{stepNumber}</p>
        <h4
          className="text-[24px] md:text-[40px] font-bold py-10"
          style={{ lineHeight: "120%" }}
        >
          {title}
        </h4>
        <p className="text-[14px] md:text-[16px] text-[#222] pb-10">{description}</p>
        <div className="flex items-center flex-wrap justify-between gap-4">
          {step > 0 && (
            <Button
              className="w-full lg:max-w-[250px]"
              size={"xl"}
              variant={"secondary"}
              onClick={handleBack}
            >
              Go Back
            </Button>
          )}
          <Button
            className="w-full lg:max-w-[250px]"
            icon={ArrowSmallRightIcon}
            size={"xl"}
            iconPosition={"right"}
            onClick={onClick}
          >
            Next
          </Button>
        </div>
      </div>
      <div>
        {imageSrc && (
          <Image
            className={"object-cover w-full rounded-lg hidden md:block lg:block xl:block 2xl:block"}
            height={400}
            src={imageSrc}
            alt="property"
            placeholder="blur"
          />
        )}
      </div>
    </div>
  );
};

export default StepsTopInfo;
