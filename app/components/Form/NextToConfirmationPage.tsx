import {
  ArrowSmallRightIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/solid";
import { Button, Icon } from "@tremor/react";
import React from "react";
import ConfirmationAdvertisementCard from "./ConfirmationAdvertisementCard";

function NextToConfirmationPage() {
  return (
    <div className="container ">
      <div className="mt-10">
        <p className="text-[18px] text-[#222] font-bold">
          You are almost done!
        </p>
        <h4
          className="text-[40px] font-bold py-10"
          style={{ lineHeight: "120%" }}
        >
          Congratulations your listing is published!
        </h4>
      </div>
      <div className="flex flex-col gap-8">
        <button
          className={
            " text-lg  w-[258px] bg-transparent border-2 text-[#4785FD] border-[#4785FD]  font-bold py-4 px-6  rounded-lg"
          }
        >
          View listing
          <Icon
            className="text-[#4785FD] pl-4 font-bold align-middle text-lg"
            icon={ArrowSmallRightIcon}
          />
        </button>
        <p className="text-lg font-normal">OR promote your listing</p>
        <p className="text-lg font-bold">
          Promoted listings get more views thus they get sold / rented sooner!
        </p>
        <ConfirmationAdvertisementCard
          title={"First page for 7 days"}
          viewCount={"7x more views on average"}
          description={
            "Your property will be listed on the home page in the selected properties section"
          }
          pricing={"$ 4.99"}
        />
        <ConfirmationAdvertisementCard
          title={"Premium add"}
          viewCount={"4x more views on average"}
          description={
            "Your property will get special label and will be shown on top of the listing at your city"
          }
          pricing={"$ 2.99"}
        />
        <div className="flex justify-between mx-4">
          <p className="text-base font-normal">Final amount including VAT:</p>
          <p className="text-base font-semibold">$ 7.98</p>
        </div>
        <div className="flex gap-8">
          <Button
            className={
              " w-[247px] text-lg  bg-transparent border-2 text-[#4785FD] border-[#4785FD]  font-bold py-4 px-6  rounded-lg"
            }
          >
            Don’t promote
          </Button>

          <Button
            className={
              " text-lg w-[286px] bg-transparent text-[#ffffff] bg-[#2C72F6]   font-bold py-4 px-6  rounded-lg"
            }
          >
            Play
            <Icon
              className="text-[#ffffff] pl-4 font-semibold align-middle text-lg"
              icon={ArrowTopRightOnSquareIcon}
            />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default NextToConfirmationPage;
