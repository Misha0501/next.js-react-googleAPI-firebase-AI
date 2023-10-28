"use client";

import { LineChart, Title } from "@tremor/react";
import { ListingPrice } from "@/types";

type Prop = {
  listingPriceArray: ListingPrice[];
};

export const PriceChangeGraphSection = ({ listingPriceArray }: Prop) => {
  if (!listingPriceArray?.length || !(listingPriceArray?.length - 1) ) return null;

  return (
    <div className="lg:pt-8">
      <div className="container">
        <p className="font-medium text-[24px] pt-14">Price change graph</p>
        <Title className="pt-8">
          This listing has changed its price {listingPriceArray?.length}{" "}
          times
        </Title>
        <LineChart
          className="mt-6"
          data={listingPriceArray ?? []}
          index="updatedAt"
          categories={["price"]}
          colors={["emerald"]}
          data-testid={"priceChangeGraph"}
        />
      </div>
    </div>
  );
};
