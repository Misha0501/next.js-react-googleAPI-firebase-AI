"use client";

import { BarChart, Title } from "@tremor/react";
import { useEffect, useState } from "react";
import { Listing } from "@/types";

type Prop = {
  listing: Listing;
};

export const PriceComparisonGraphSection = ({ listing }: Prop) => {
  const [
    averagePriceNeighborhoodChartData,
    setAveragePriceNeighborhoodChartData,
  ] = useState();

  useEffect(() => {
    if (listing?.averagePriceInNeighborhood) {
      // @ts-ignore
      setAveragePriceNeighborhoodChartData([
        {
          name: "Average price in the neighborhood",
          "Listing price": listing?.averagePriceInNeighborhood,
        },
        {
          name: "This listing's price",
          "Listing price": listing?.price,
        },
      ]);
    }
  }, [listing?.averagePriceInNeighborhood, listing?.price]);

  const dataFormatter = (number: number) => {
    return "€ " + Intl.NumberFormat("eu").format(number).toString();
  };

  if (!listing?.averagePriceInNeighborhood) return null;

  return (
    <div className={"py-12"}>
      <div className="container">
        <p className="font-medium text-[24px]">Price comparison graph</p>
        <Title className="pt-8">
          This graph shows the average price in the neighborhood{" "}
          {listing?.Address[0]?.neighborhood} for properties with the same
          type compared to this listing.
        </Title>
        <BarChart
          className="mt-6"
          data={averagePriceNeighborhoodChartData}
          index="name"
          categories={["Listing price"]}
          colors={["blue"]}
          valueFormatter={dataFormatter}
          yAxisWidth={48}
          data-testid={"averagePriceNeighborhoodChart"}
        />
      </div>
    </div>
  );
};
