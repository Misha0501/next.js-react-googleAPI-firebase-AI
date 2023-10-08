import { Button } from "@tremor/react";
import React from "react";
import { Listing } from "@/types";
import Link from "next/link";

type Props = {
  listingItem: Listing | null;
};
function NextToConfirmationPage({listingItem}: Props) {
  return (
    <div className="container ">
      <div className="mt-10">
        <h4
          className="text-[40px] font-bold py-10"
          style={{ lineHeight: "120%" }}
        >
          Congratulations your listing is published!
        </h4>
      </div>
      <div className="flex flex-col gap-8">
        <Link href={`/listings/${listingItem?.id}`}><Button variant="secondary">View listing</Button></Link>
      </div>
    </div>
  );
}

export default NextToConfirmationPage;
