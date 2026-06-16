import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  BuildingOffice2Icon,
  MapPinIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";

const featuredMarket = {
  locality: "Sofia",
  href: "/listings?locality=Sofia&listingType=SELL",
  img: "/e1.png",
  eyebrow: "Most searched",
  title: "Sofia city homes",
  description:
    "Explore apartments and houses in Bulgaria's capital with clear euro pricing and practical property details.",
  highlights: ["Capital market", "Strong demand", "Urban living"],
};

const popularSearches = [
  {
    locality: "Plovdiv",
    href: "/listings?locality=Plovdiv&listingType=SELL",
    img: "/e3.jpg",
    label: "Historic city living",
    meta: "Apartments and family homes",
  },
  {
    locality: "Varna",
    href: "/listings?locality=Varna&listingType=SELL",
    img: "/e4.jpg",
    label: "Black Sea market",
    meta: "Coastal homes and city flats",
  },
  {
    locality: "Byala",
    href: "/listings?locality=Byala&listingType=SELL",
    img: "/e2.jpg",
    label: "Coastal value",
    meta: "Holiday homes and quiet streets",
  },
];

function ExploreHomeSection() {
  return (
    <section className="bg-[linear-gradient(180deg,#FFFFFF_0%,#F8FAFC_100%)] py-24 lg:py-32">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#CFE0FF] bg-[#EAF2FF] px-3 py-1.5 text-xs font-black uppercase tracking-wide text-[#1F5FD6]">
              <MapPinIcon className="h-4 w-4" />
              Explore Bulgaria
            </p>
            <h2 className="text-3xl font-black tracking-tight text-[#1F2937] md:text-5xl md:leading-tight">
              Explore properties with us
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[#64748B]">
              Start with the Bulgarian markets people search most, then refine
              by price, area, rooms and property type.
            </p>
          </div>

          <Link
            href="/listings?listingType=SELL"
            className="min-h-12 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-[#334155] shadow-sm transition hover:border-[#1F5FD6] hover:text-[#1F5FD6] sm:w-auto"
          >
            View all properties
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.08fr_0.92fr] lg:gap-6">
          <Link
            href={featuredMarket.href}
            className="group relative isolate min-h-[460px] transform-gpu rounded-2xl border border-slate-200 bg-slate-950 shadow-sm transition duration-300 will-change-transform hover:-translate-y-0.5 hover:shadow-[0_24px_70px_rgba(15,23,42,0.18)] focus:outline-none focus:ring-2 focus:ring-[#1F5FD6]/30 focus:ring-offset-2"
          >
            <div className="absolute inset-0 overflow-hidden rounded-[inherit]">
              <Image
                className="object-cover transition duration-500 group-hover:scale-105"
                fill
                sizes="(min-width: 1024px) 55vw, 100vw"
                src={featuredMarket.img}
                alt={`${featuredMarket.locality} properties`}
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.10)_0%,rgba(15,23,42,0.38)_42%,rgba(15,23,42,0.88)_100%)]" />
            </div>
            <div className="absolute inset-0 flex flex-col justify-between p-5 sm:p-7">
              <div className="flex items-center justify-between gap-3">
                <span className="bg-white/15 inline-flex items-center gap-2 rounded-full border border-white/25 px-3 py-1.5 text-xs font-black uppercase tracking-wide text-white backdrop-blur">
                  <SparklesIcon className="h-4 w-4" />
                  {featuredMarket.eyebrow}
                </span>
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#1F5FD6] shadow-sm transition group-hover:scale-105">
                  <ArrowUpRightIcon className="h-5 w-5" />
                </span>
              </div>

              <div>
                <div className="mb-5 flex flex-wrap gap-2">
                  {featuredMarket.highlights.map((item) => (
                    <span
                      key={item}
                      className="bg-white/12 rounded-full border border-white/20 px-3 py-1.5 text-xs font-bold text-white/90 backdrop-blur"
                    >
                      {item}
                    </span>
                  ))}
                </div>
                <h3 className="text-3xl font-black tracking-tight text-white md:text-5xl">
                  {featuredMarket.title}
                </h3>
                <p className="mt-4 max-w-xl text-sm leading-6 text-white md:text-base">
                  {featuredMarket.description}
                </p>
              </div>
            </div>
          </Link>

          <div className="grid gap-5">
            {popularSearches.map((item) => (
              <Link
                className="group grid min-h-[150px] transform-gpu overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 will-change-transform hover:-translate-y-0.5 hover:border-[#CFE0FF] hover:shadow-[0_20px_54px_rgba(15,23,42,0.12)] focus:outline-none focus:ring-2 focus:ring-[#1F5FD6]/30 focus:ring-offset-2 sm:grid-cols-[190px_1fr]"
                key={item.href}
                href={item.href}
              >
                <div className="relative min-h-[170px] overflow-hidden bg-slate-100 sm:min-h-full">
                  <Image
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    width={420}
                    height={315}
                    sizes="(min-width: 1024px) 190px, 100vw"
                    src={item.img}
                    alt={`${item.locality} properties`}
                  />
                  <div className="from-slate-950/35 absolute inset-0 bg-gradient-to-t to-transparent sm:hidden" />
                </div>

                <div className="flex min-w-0 flex-col justify-between gap-5 p-5">
                  <div>
                    <p className="mb-3 inline-flex items-center gap-2 text-xs font-black uppercase tracking-wide text-[#1F5FD6]">
                      <BuildingOffice2Icon className="h-4 w-4" />
                      {item.label}
                    </p>
                    <h3 className="text-2xl font-black text-[#1F2937]">
                      {item.locality}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-[#64748B]">
                      {item.meta}
                    </p>
                  </div>

                  <span className="inline-flex w-fit items-center gap-2 rounded-xl bg-[#EAF2FF] px-3 py-2 text-sm font-bold text-[#1F5FD6] transition group-hover:bg-[#1F5FD6] group-hover:text-white">
                    Explore
                    <ArrowRightIcon className="h-4 w-4 transition group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ExploreHomeSection;
