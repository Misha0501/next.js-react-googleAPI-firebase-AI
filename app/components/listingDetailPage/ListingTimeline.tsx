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

const dot: Record<
  TimelineEvent["type"],
  { bg: string; icon: React.ReactNode }
> = {
  listed: {
    bg: "bg-[#EAF2FF] border-[#BFD4FF]",
    icon: <CheckCircleIcon className="h-4 w-4 text-[#1F5FD6]" />,
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
      label: isExpired ? "Property expired" : "Active until",
      type: "expiry",
    });
  }

  if (events.length < 2) return null;

  const sortedEvents = events.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  return (
    <section>
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white px-5 py-6 shadow-sm sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-lg font-semibold text-[#2D3648] sm:text-xl">
                Property history
              </p>
              <p className="mt-1 text-sm text-[#717D96]">
                Price and availability changes over time
              </p>
            </div>
          </div>

          {/* Desktop horizontal timeline */}
          <div className="hidden overflow-x-auto scrollbar-hide md:block">
            <div className="flex min-w-max items-start pb-2">
              {sortedEvents.map((event, i) => (
                <div key={i} className="flex items-start">
                  {/* Event */}
                  <div className="flex w-44 flex-col items-center">
                    <div
                      className={`mb-3 flex h-9 w-9 items-center justify-center rounded-full border-2 ${dot[event.type].bg}`}
                    >
                      {dot[event.type].icon}
                    </div>
                    <p className="mb-1 text-xs text-[#717D96]">
                      {fmt(event.date)}
                    </p>
                    <p className="text-center text-sm font-semibold text-[#2D3648]">
                      {event.label}
                    </p>
                    {event.sublabel && (
                      <p className="mt-0.5 text-sm text-[#717D96]">
                        {event.sublabel}
                      </p>
                    )}
                  </div>
                  {/* Connector */}
                  {i < sortedEvents.length - 1 && (
                    <div className="mt-4 h-px w-12 shrink-0 bg-slate-300" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Mobile vertical timeline */}
          <div className="flex flex-col gap-0 md:hidden">
            {sortedEvents.map((event, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 ${dot[event.type].bg}`}
                  >
                    {dot[event.type].icon}
                  </div>
                  {i < sortedEvents.length - 1 && (
                    <div className="my-1 w-px flex-1 bg-slate-200" />
                  )}
                </div>
                <div className="pb-6">
                  <p className="text-xs text-[#717D96]">{fmt(event.date)}</p>
                  <p className="text-sm font-semibold text-[#2D3648]">
                    {event.label}
                  </p>
                  {event.sublabel && (
                    <p className="text-sm text-[#717D96]">{event.sublabel}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
