"use client";

import { AreaChart } from "@tremor/react";
import { ListingPrice } from "@/types";
import { formatEuroPrice } from "@/app/lib/formatPrice";
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon, MinusIcon } from "@heroicons/react/24/outline";

type Prop = {
  listingPriceArray: ListingPrice[];
};

export const PriceChangeGraphSection = ({ listingPriceArray }: Prop) => {
  if (!listingPriceArray?.length || !(listingPriceArray?.length - 1)) return null;

  const priceHistory = [...listingPriceArray].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );
  const prices = priceHistory.map((p) => p.price).filter(Boolean) as number[];
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const yAxisMin = Math.floor(minPrice * 0.95);
  const yAxisMax = Math.ceil(maxPrice * 1.05);

  const chartData = priceHistory.map((item) => ({
    date: new Date(item.createdAt).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
    Price: item.price,
  }));

  return (
    <div className="py-8 lg:py-10">
      <div className="container">
        <p className="font-semibold text-[#2D3648] text-2xl mb-6">
          Price history
        </p>

        {/* Price change timeline */}
        <div className="flex flex-wrap gap-3 mb-8">
          {priceHistory.map((item, i) => {
            const prev = priceHistory[i - 1];
            const priceDiff = prev ? item.price - prev.price : 0;
            const pct = prev ? ((priceDiff / prev.price) * 100).toFixed(1) : null;
            const isUp = priceDiff > 0;
            const isDown = priceDiff < 0;

            return (
              <div
                key={item.id}
                className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg px-4 py-3"
              >
                <div>
                  <p className="text-xs text-[#717D96] mb-0.5">
                    {new Date(item.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                  <p className="font-semibold text-[#2D3648]">
                    {formatEuroPrice(item.price)}
                  </p>
                </div>
                {pct && (
                  <div
                    className={`flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-md ${
                      isUp
                        ? "bg-red-50 text-red-600"
                        : "bg-green-50 text-green-600"
                    }`}
                  >
                    {isUp ? (
                      <ArrowTrendingUpIcon className="h-4 w-4" />
                    ) : (
                      <ArrowTrendingDownIcon className="h-4 w-4" />
                    )}
                    {Math.abs(Number(pct))}%
                  </div>
                )}
                {i === 0 && (
                  <div className="flex items-center gap-1 text-sm text-[#717D96] px-2 py-1 bg-gray-50 rounded-md">
                    <MinusIcon className="h-4 w-4" />
                    Initial
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Chart */}
        <AreaChart
          className="mt-2"
          data={chartData}
          index="date"
          categories={["Price"]}
          colors={["blue"]}
          valueFormatter={formatEuroPrice}
          yAxisWidth={88}
          curveType="step"
          minValue={yAxisMin}
          maxValue={yAxisMax}
          showAnimation
          data-testid="priceChangeGraph"
        />
      </div>
    </div>
  );
};
