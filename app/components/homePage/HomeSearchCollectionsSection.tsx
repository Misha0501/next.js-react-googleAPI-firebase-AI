import Link from "next/link";
import {
  BuildingOffice2Icon,
  HomeModernIcon,
  MapIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

type CollectionSearchParams = {
  listingType?: "SELL" | "RENT";
  locality?: string;
  propertyType?: string[];
};

const getListingsHref = ({
  listingType = "SELL",
  locality,
  propertyType,
}: CollectionSearchParams) => {
  const params = new URLSearchParams({ listingType });

  if (locality) {
    params.set("locality", locality);
  }

  if (propertyType?.length) {
    params.set("propertyType", JSON.stringify(propertyType));
  }

  return `/listings?${params.toString()}`;
};

const collections = [
  {
    title: "City apartments",
    description: "Central homes with quick access to business districts.",
    href: getListingsHref({
      locality: "Sofia",
      propertyType: ["APARTMENT"],
    }),
    cta: "Browse Sofia",
    icon: BuildingOffice2Icon,
  },
  {
    title: "Family houses",
    description: "More rooms, outdoor space, and calmer residential streets.",
    href: getListingsHref({ propertyType: ["HOUSE"] }),
    cta: "View houses",
    icon: HomeModernIcon,
  },
  {
    title: "Coastal living",
    description: "Homes near the sea in Varna, Burgas, and nearby towns.",
    href: getListingsHref({
      locality: "Varna",
      propertyType: ["HOUSE", "APARTMENT"],
    }),
    cta: "Explore coast",
    icon: SparklesIcon,
  },
  {
    title: "Land and plots",
    description: "Plots for building, investment, or long-term plans.",
    href: getListingsHref({ propertyType: ["LAND"] }),
    cta: "Find land",
    icon: MapIcon,
  },
];

function HomeSearchCollectionsSection() {
  return (
    <section className="border-b border-slate-200/80 bg-[#F8FAFC] py-20 lg:py-24">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="mb-3 text-sm font-bold uppercase tracking-wide text-[#1F5FD6]">
              Search by need
            </p>
            <h2 className="text-2xl font-bold text-[#222222] md:text-[40px] md:leading-tight">
              Start closer to the right property
            </h2>
            <p className="mt-3 text-[#717D96]">
              Jump into focused collections that match common buying goals in
              Bulgaria.
            </p>
          </div>
          <Link
            href="/listings"
            className="inline-flex items-center justify-center rounded-lg border border-[#1F5FD6] px-5 py-3 text-sm font-bold text-[#1F5FD6] transition-colors hover:bg-[#1F5FD6] hover:text-white"
          >
            View all listings
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {collections.map((collection) => {
            const Icon = collection.icon;

            return (
              <Link
                key={collection.title}
                href={collection.href}
                className="group flex min-h-[220px] flex-col justify-between rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-[#1F5FD6]/35 hover:shadow-xl"
              >
                <div>
                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-[#1F5FD6]/10 text-[#1F5FD6] transition-colors group-hover:bg-[#1F5FD6] group-hover:text-white">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-[#222222]">
                    {collection.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[#717D96]">
                    {collection.description}
                  </p>
                </div>
                <span className="mt-6 text-sm font-bold text-[#1F5FD6]">
                  {collection.cta}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default HomeSearchCollectionsSection;
