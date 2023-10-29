"use client";

import { EnvelopeIcon, PhoneIcon } from "@heroicons/react/24/outline";
import { Button } from "@tremor/react";
import { useListigDetailContext } from "@/app/context/ListingDetailContext";
import { useRouter } from "next/navigation";
import { Listing } from "@/types";

type Props = {
  listing?: Listing;
  initialPhoneNumber?: string;
};
export const FloatingContactBar = ({
  listing,
  initialPhoneNumber,
}: Props) => {
  const {setContactSellerFormVisible} = useListigDetailContext();
  const router = useRouter();
  const handleContactAgentClick = () => {
    setContactSellerFormVisible(true);
    // navigate to the contact form
    router.push("#contactAgentForm");
  };

  let phoneNumber =
    initialPhoneNumber ??
    listing?.company?.phoneNumber ??
    listing?.applicationUser?.phoneNumber ??
    "";

  return (
    <div className="fixed bottom-[68px] left-0 right-0 bg-white border-t-2 lg:hidden shadow-2xl py-4">
      <div className="container flex items-center gap-4 justify-around">
        {phoneNumber && (
          <a href={`tel:${phoneNumber}`} className="w-1/2">
            <Button variant="secondary" icon={PhoneIcon} className={"w-full"}>
              Call
            </Button>
          </a>
        )}
        <Button
          variant="primary"
          icon={EnvelopeIcon}
          className="w-1/2"
          onClick={handleContactAgentClick}
        >
          Contact Seller
        </Button>
      </div>
    </div>
  );
};

export default FloatingContactBar;
