import React from "react";
import PropTypes from "prop-types";
import { ArrowSmallRightIcon } from "@heroicons/react/24/solid";
import { Button, Icon } from "@tremor/react";
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
        <div className="flex items-center justify-between gap-2.5">
          {step > 0 && (
            <Button
              className="w-2/5 h-[56px] mt-8  bg-transparent border border-[#2C72F6] text-[#2C72F6]"
              onClick={handleBack}
            >
              Go Back
            </Button>
          )}
          <Button
            className="w-3/5 h-[56px] mt-8 border border-[#2C72F6]"
            onClick={onClick}
          >
            Next{" "}
            <Icon
              className="text-white align-middle"
              icon={ArrowSmallRightIcon}
            />
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
