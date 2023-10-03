import React, { useState } from "react";
import { Listing } from "@/types";
import { getCurrencySign } from "@/app/lib/getCurrencySign";
import Link from "next/link";
import { Button } from "@tremor/react";

type Props = {
  showForm: () => void;
  listing: Listing | undefined;
};

function ListingAgentContactCard({ showForm, listing }: Props) {
  let [agentContactState, setAgentContactState] = useState("Show Phone Number");

  let contactNumber =
    listing?.company?.phoneNumber ??
    listing?.applicationUser?.phoneNumber ??
    "";
  const showContactNo = () => {
    setAgentContactState(
      agentContactState !== contactNumber ? contactNumber : "Show Phone Number",
    );
  };

  const showContactForm = () => {
    showForm((prevState: boolean) => !prevState);
  };

  return (
    <>
      <div className=" mb-8 w-full bg-[#F2F2F2] rounded-lg shadow-md px-8 py-9">
        <div className="mb-8">
          <p className="mb-1 font-light text-gray-500 dark:text-gray-400">
            Asking Price{" "}
          </p>
          <div className="flex items-baseline mb-8 text-gray-900 dark:text-white">
            <span className="text-2xl font-semibold">
              {getCurrencySign(listing?.currency)}
            </span>
            <span className="text-3xl font-semibold tracking-tight">
              {new Intl.NumberFormat().format(listing?.price)}
            </span>
          </div>
          {contactNumber && (
            <>
              {agentContactState !== contactNumber && (
                <Button
                  onClick={showContactNo}
                  className="w-full"
                  variant={"secondary"}
                >
                  {agentContactState}
                </Button>
              )}
              {agentContactState === contactNumber && (
                <a href={`tel:${contactNumber}`}>
                  <Button className="w-full" variant={"secondary"}>
                    {agentContactState}
                  </Button>
                </a>
              )}
            </>
          )}
        </div>
        <div>
          <p className="mb-6 font-light text-gray-500 dark:text-gray-400">
            Listed by{" "}
            {listing?.company?.name ? " real estate agent" : " private owner"}
          </p>
          <div className="flex items-center space-x-4 mb-8">
            <div className="flex-1 min-w-0">
              <Link href={`/users/${listing?.applicationUser?.id}`}>
                <p className="font-bold text-gray-900 truncate dark:text-white">
                  {listing?.applicationUser?.displayName}
                </p>
                {listing?.company?.name && (
                  <p className="text-md text-gray-500 truncate dark:text-gray-400">
                    {listing?.company?.name}
                  </p>
                )}
              </Link>
            </div>
          </div>
          <Button
            onClick={showContactForm}
            variant={"primary"}
            className={"w-full"}
          >
            Contact seller
          </Button>
        </div>
      </div>
    </>
  );
}

export default ListingAgentContactCard;
