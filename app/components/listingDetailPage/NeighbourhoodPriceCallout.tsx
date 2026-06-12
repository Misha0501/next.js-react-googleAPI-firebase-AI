import { Listing } from "@/types";
import { formatEuroPrice } from "@/app/lib/formatPrice";
import { ArrowTrendingDownIcon, ArrowTrendingUpIcon } from "@heroicons/react/24/outline";

type Prop = { listing: Listing };

export const NeighbourhoodPriceCallout = ({ listing }: Prop) => {
  if (!listing?.averagePriceInNeighborhood || !listing?.price) return null;

  const avg = listing.averagePriceInNeighborhood;
  const price = listing.price;
  const diff = price - avg;
  const pct = Math.abs((diff / avg) * 100).toFixed(1);
  const isAbove = diff > 0;

  return (
    <div className="mb-6 w-full bg-white border border-gray-200 rounded-xl shadow-sm px-8 py-6">
      <p className="text-xs uppercase tracking-widest text-[#717D96] mb-4">
        Neighbourhood price
      </p>

      <div
        className={`flex items-center gap-3 rounded-lg px-4 py-3 mb-4 ${
          isAbove ? "bg-red-50" : "bg-green-50"
        }`}
      >
        {isAbove ? (
          <ArrowTrendingUpIcon className="h-5 w-5 text-red-500 shrink-0" />
        ) : (
          <ArrowTrendingDownIcon className="h-5 w-5 text-green-600 shrink-0" />
        )}
        <p className={`font-semibold ${isAbove ? "text-red-600" : "text-green-700"}`}>
          {pct}% {isAbove ? "above" : "below"} neighbourhood average
        </p>
      </div>

      <div className="flex justify-between items-center text-sm">
        <div>
          <p className="text-[#717D96] mb-0.5">This listing</p>
          <p className="font-semibold text-[#2D3648]">{formatEuroPrice(price)}</p>
        </div>
        <div className="h-8 w-px bg-gray-200" />
        <div className="text-right">
          <p className="text-[#717D96] mb-0.5">Neighbourhood avg</p>
          <p className="font-semibold text-[#2D3648]">{formatEuroPrice(avg)}</p>
        </div>
      </div>

      {listing?.Address?.[0]?.neighborhood && (
        <p className="text-xs text-[#717D96] mt-4">
          Based on similar properties in {listing.Address[0].neighborhood}
        </p>
      )}
    </div>
  );
};
