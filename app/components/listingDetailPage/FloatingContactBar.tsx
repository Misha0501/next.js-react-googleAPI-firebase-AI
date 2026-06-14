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
export const FloatingContactBar = ({ listing, initialPhoneNumber }: Props) => {
  const { setContactSellerFormVisible } = useListigDetailContext();
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
  const actionWidth = phoneNumber ? "w-1/2" : "w-full";

  return (
    <div className="fixed bottom-[68px] left-0 right-0 z-40 border-t border-slate-200 bg-white/95 py-3 shadow-2xl backdrop-blur lg:hidden">
      <div className="mx-auto flex max-w-screen-sm items-center gap-3 px-4">
        {phoneNumber && (
          <a href={`tel:${phoneNumber}`} className={actionWidth}>
            <Button variant="secondary" icon={PhoneIcon} className={"w-full"}>
              Call
            </Button>
          </a>
        )}
        <Button
          variant="primary"
          icon={EnvelopeIcon}
          className={actionWidth}
          onClick={handleContactAgentClick}
        >
          Contact seller
        </Button>
      </div>
    </div>
  );
};

export default FloatingContactBar;
