import Image from "next/image";
import React, { useState } from "react";

import property1 from "@/public/Ajmere-Dale-Square-thumbnail.jpg";

function ListingAgentContactCard({ showForm, propertyPrice }: any) {
  const allDetails = {
    propertyPrice: "312.000",
    agentName: "Sofia Johns",
    stateName: "Sofia Real State",
    agentContactNo: "+ 1 (234) 567-89-00",
  };
  let [agentContactState, setAgentContactState] = useState("Show Phone Number");
  const showContactNo = () => {
    setAgentContactState(
      agentContactState !== allDetails.agentContactNo
        ? allDetails.agentContactNo
        : "Show Phone Number"
    );
  };
  const showContactForm = () => {
    showForm((prevState: boolean) => !prevState);
    // showForm(true)
  };

  return (
    <>
      <div className=" mb-8 w-full max-w-md bg-[#F2F2F2]  rounded-lg shadow-md px-8 py-9">
        <div className="mb-8">
          <p className="mb-1 text-lg  font-light text-gray-500 dark:text-gray-400">
            Rent Price{" "}
          </p>
          <div className="flex items-baseline mb-8 text-gray-900 dark:text-white">
            <span className="text-3xl font-semibold">€ </span>
            <span className="text-3xl font-semibold tracking-tight">
              {propertyPrice}
            </span>
          </div>
          <button
            onClick={showContactNo}
            type="button"
            className="text-blue-600 bg-transparent  font-extrabold   border-blue-600 border-2 p-4 rounded-lg text-xl  inline-flex justify-center w-full text-center"
          >
            {agentContactState}
          </button>
        </div>
        <div>
          <p className="mb-6 text-lg  font-light text-gray-500 dark:text-gray-400">
            Listed by real estate agent{" "}
          </p>
          <div className="flex items-center space-x-4 mb-8">
            <div className="flex">
              <Image
                width={50}
                height={50}
                className=" rounded-full"
                src={property1}
                alt="Agent image"
                placeholder="blur"
              />
            </div>
            <div className="flex-1  min-w-0">
              <p className="text-lg font-bold text-gray-900 truncate dark:text-white">
                {allDetails.agentName}
              </p>
              <p className="text-md text-gray-500 truncate dark:text-gray-400">
                {allDetails.stateName}
              </p>
            </div>
          </div>
          <button
            onClick={showContactForm}
            type="button"
            className="text-white bg-[#2C72F6]  font-extrabold p-4 rounded-lg text-xl  inline-flex justify-center w-full text-center"
          >
            Contact with agent{" "}
          </button>
        </div>
      </div>
    </>
  );
}

export default ListingAgentContactCard;
