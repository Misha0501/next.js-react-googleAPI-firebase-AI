"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { ListingPrice } from "@/types";
import { formatEuroPrice } from "@/app/lib/formatPrice";
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  MinusIcon,
} from "@heroicons/react/24/outline";

type Prop = {
  listingPriceArray: ListingPrice[];
};

export const PriceChangeGraphSection = ({ listingPriceArray }: Prop) => {
  if (!listingPriceArray?.length || !(listingPriceArray?.length - 1))
    return null;

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
    <section>
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white px-5 py-6 shadow-sm sm:px-6 lg:px-8">
          <div className="mb-6">
            <p className="text-lg font-semibold text-[#2D3648] sm:text-xl">
              Price history
            </p>
            <p className="mt-1 text-sm text-[#717D96]">
              How the asking price changed since the listing was published
            </p>
          </div>

          {/* Price change timeline */}
          <div className="mb-8 flex flex-wrap gap-3">
            {priceHistory.map((item, i) => {
              const prev = priceHistory[i - 1];
              const priceDiff = prev ? item.price - prev.price : 0;
              const pct = prev
                ? ((priceDiff / prev.price) * 100).toFixed(1)
                : null;
              const isUp = priceDiff > 0;

              return (
                <div
                  key={item.id}
                  className="flex items-center gap-3 rounded-xl border border-slate-200 bg-[#F8FAFC] px-4 py-3"
                >
                  <div>
                    <p className="mb-0.5 text-xs text-[#717D96]">
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
                      className={`flex items-center gap-1 rounded-lg px-2 py-1 text-sm font-medium ${
                        isUp
                          ? "bg-rose-50 text-rose-600"
                          : "bg-emerald-50 text-emerald-600"
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
                    <div className="flex items-center gap-1 rounded-lg bg-white px-2 py-1 text-sm text-[#717D96]">
                      <MinusIcon className="h-4 w-4" />
                      Initial
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Chart */}
          <div className="mt-2" data-testid="priceChangeGraph">
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart
                data={chartData}
                margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="priceGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="#3b82f6"
                      stopOpacity={0.15}
                    />
                    <stop
                      offset="95%"
                      stopColor="#3b82f6"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e2e8f0"
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  width={88}
                  domain={[yAxisMin, yAxisMax]}
                  tickFormatter={(v) => formatEuroPrice(v as number)}
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  formatter={(value) => [
                    formatEuroPrice(value as number),
                    "Price",
                  ]}
                  contentStyle={{
                    borderRadius: "0.75rem",
                    border: "1px solid #e2e8f0",
                    padding: "8px 12px",
                    fontSize: 12,
                  }}
                  labelStyle={{ color: "#717D96", marginBottom: 4 }}
                />
                <Area
                  type="step"
                  dataKey="Price"
                  stroke="#3b82f6"
                  fill="url(#priceGradient)"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: "#3b82f6" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  );
};
