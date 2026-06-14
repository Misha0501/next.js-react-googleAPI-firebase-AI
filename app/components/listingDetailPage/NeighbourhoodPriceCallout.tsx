import { Listing } from "@/types";
import { formatEuroPrice } from "@/app/lib/formatPrice";
import {
  ArrowTrendingDownIcon,
  ArrowTrendingUpIcon,
} from "@heroicons/react/24/outline";

type Prop = { listing: Listing };

export const NeighbourhoodPriceCallout = ({ listing }: Prop) => {
  if (!listing?.averagePriceInNeighborhood || !listing?.price) return null;

  const avg = listing.averagePriceInNeighborhood;
  const price = listing.price;
  const diff = price - avg;
  const pct = Math.abs((diff / avg) * 100).toFixed(1);
  const isAbove = diff > 0;

  return (
    <div className="w-full rounded-2xl border border-slate-200 bg-white px-6 py-6 shadow-sm">
      <p className="mb-4 text-xs font-semibold uppercase text-[#717D96]">
        Neighbourhood price
      </p>

      <div
        className={`mb-4 flex items-center gap-3 rounded-xl px-4 py-3 ${
          isAbove ? "bg-rose-50" : "bg-emerald-50"
        }`}
      >
        {isAbove ? (
          <ArrowTrendingUpIcon className="h-5 w-5 shrink-0 text-rose-500" />
        ) : (
          <ArrowTrendingDownIcon className="h-5 w-5 shrink-0 text-emerald-600" />
        )}
        <p
          className={`font-semibold ${
            isAbove ? "text-rose-600" : "text-emerald-700"
          }`}
        >
          {pct}% {isAbove ? "above" : "below"} neighbourhood average
        </p>
      </div>

      <div className="flex items-center justify-between text-sm">
        <div>
          <p className="mb-0.5 text-[#717D96]">This listing</p>
          <p className="font-semibold text-[#2D3648]">
            {formatEuroPrice(price)}
          </p>
        </div>
        <div className="h-8 w-px bg-slate-200" />
        <div className="text-right">
          <p className="mb-0.5 text-[#717D96]">Neighbourhood avg</p>
          <p className="font-semibold text-[#2D3648]">{formatEuroPrice(avg)}</p>
        </div>
      </div>

      {listing?.Address?.[0]?.neighborhood && (
        <p className="mt-4 text-xs leading-5 text-[#717D96]">
          Based on similar properties in {listing.Address[0].neighborhood}
        </p>
      )}
    </div>
  );
};
