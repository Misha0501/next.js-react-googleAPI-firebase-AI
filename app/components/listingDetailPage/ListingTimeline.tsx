import { Listing } from "@/types";
import { formatEuroPrice } from "@/app/lib/formatPrice";
import {
  CheckCircleIcon,
  ClockIcon,
  TagIcon,
} from "@heroicons/react/24/outline";

type Prop = { listing: Listing };

type TimelineEvent = {
  date: string;
  label: string;
  sublabel?: string;
  type: "listed" | "price" | "expiry";
};

const dot: Record<TimelineEvent["type"], { bg: string; icon: React.ReactNode }> = {
  listed: {
    bg: "bg-blue-100 border-blue-300",
    icon: <CheckCircleIcon className="h-4 w-4 text-blue-600" />,
  },
  price: {
    bg: "bg-amber-50 border-amber-300",
    icon: <TagIcon className="h-4 w-4 text-amber-600" />,
  },
  expiry: {
    bg: "bg-gray-100 border-gray-300",
    icon: <ClockIcon className="h-4 w-4 text-gray-500" />,
  },
};

const fmt = (d: string) =>
  new Date(d).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const byCreatedAt = (a: { createdAt: string }, b: { createdAt: string }) =>
  new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();

export const ListingTimeline = ({ listing }: Prop) => {
  if (!listing?.createdAt) return null;

  const events: TimelineEvent[] = [];
  const priceHistory = [...(listing.ListingPrice ?? [])].sort(byCreatedAt);

  // Listed event
  const initialPrice = priceHistory[0];
  events.push({
    date: listing.createdAt,
    label: "Listed",
    sublabel: initialPrice ? formatEuroPrice(initialPrice.price) : undefined,
    type: "listed",
  });

  // Price change events (oldest → newest, skip the initial price)
  if (priceHistory.length > 1) {
    priceHistory.slice(1).forEach((lp, i) => {
      const prev = priceHistory[i];
      const isDown = prev && lp.price < prev.price;
      events.push({
        date: lp.createdAt,
        label: isDown ? "Price reduced" : "Price updated",
        sublabel: formatEuroPrice(lp.price),
        type: "price",
      });
    });
  }

  // Active until / expiry
  if (listing.activeUntil) {
    const isExpired = new Date(listing.activeUntil) < new Date();
    events.push({
      date: listing.activeUntil,
      label: isExpired ? "Listing expired" : "Active until",
      type: "expiry",
    });
  }

  if (events.length < 2) return null;

  const sortedEvents = events.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  return (
    <div className="py-8 lg:py-10">
      <div className="container">
        <p className="font-semibold text-[#2D3648] text-2xl mb-8">
          Listing history
        </p>

        {/* Desktop horizontal timeline */}
        <div className="hidden md:block overflow-x-auto scrollbar-hide">
          <div className="flex items-start min-w-max pb-2">
            {sortedEvents.map((event, i) => (
              <div key={i} className="flex items-start">
                {/* Event */}
                <div className="flex flex-col items-center w-44">
                  <div
                    className={`h-8 w-8 rounded-full border-2 flex items-center justify-center mb-3 ${dot[event.type].bg}`}
                  >
                    {dot[event.type].icon}
                  </div>
                  <p className="text-xs text-[#717D96] mb-1">{fmt(event.date)}</p>
                  <p className="text-sm font-semibold text-[#2D3648] text-center">
                    {event.label}
                  </p>
                  {event.sublabel && (
                    <p className="text-sm text-[#717D96] mt-0.5">{event.sublabel}</p>
                  )}
                </div>
                {/* Connector */}
                {i < sortedEvents.length - 1 && (
                  <div className="h-px w-12 bg-gray-300 mt-4 shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Mobile vertical timeline */}
        <div className="md:hidden flex flex-col gap-0">
          {sortedEvents.map((event, i) => (
            <div key={i} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={`h-8 w-8 rounded-full border-2 flex items-center justify-center shrink-0 ${dot[event.type].bg}`}
                >
                  {dot[event.type].icon}
                </div>
                {i < sortedEvents.length - 1 && (
                  <div className="w-px flex-1 bg-gray-200 my-1" />
                )}
              </div>
              <div className="pb-6">
                <p className="text-xs text-[#717D96]">{fmt(event.date)}</p>
                <p className="text-sm font-semibold text-[#2D3648]">{event.label}</p>
                {event.sublabel && (
                  <p className="text-sm text-[#717D96]">{event.sublabel}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
