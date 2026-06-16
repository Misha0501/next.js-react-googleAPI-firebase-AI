import { Listing } from "@/types";
import {
  BuildingOffice2Icon,
  CalendarIcon,
  FireIcon,
  HomeModernIcon,
  SparklesIcon,
  TruckIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";

type Prop = { listing: Listing };

const Chip = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
  <div className="flex items-center gap-2.5 whitespace-nowrap rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EAF2FF] text-[#1F5FD6]">
      {icon}
    </span>
    <span className="text-sm font-medium text-[#2D3648]">{label}</span>
  </div>
);

const upkeepLabel: Record<string, string> = {
  EXCELLENT: "Excellent upkeep",
  GOOD: "Good upkeep",
  FAIR: "Fair upkeep",
  POOR: "Needs work",
};

const interiorLabel: Record<string, string> = {
  FURNISHED: "Furnished",
  UNFURNISHED: "Unfurnished",
};

const heatingLabel: Record<string, string> = {
  BOILER: "Boiler heating",
  CENTRAL: "Central heating",
};

export const KeyHighlightsBar = ({ listing }: Prop) => {
  const chips: { icon: React.ReactNode; label: string }[] = [];

  if (listing?.floorNumber != null) {
    const label = listing?.numberOfFloorsCommon
      ? `Floor ${listing.floorNumber} of ${listing.numberOfFloorsCommon}`
      : `Floor ${listing.floorNumber}`;
    chips.push({ icon: <BuildingOffice2Icon className="h-4 w-4" />, label });
  }

  if (listing?.interiorType) {
    chips.push({
      icon: <HomeModernIcon className="h-4 w-4" />,
      label: interiorLabel[listing.interiorType] ?? listing.interiorType,
    });
  }

  if (listing?.heatingType) {
    chips.push({
      icon: <FireIcon className="h-4 w-4" />,
      label: heatingLabel[listing.heatingType] ?? listing.heatingType,
    });
  }

  if (listing?.constructedYear) {
    const year = new Date(listing.constructedYear).getFullYear();
    chips.push({
      icon: <CalendarIcon className="h-4 w-4" />,
      label: `Built ${year}`,
    });
  }

  if (listing?.parking) {
    chips.push({
      icon: <TruckIcon className="h-4 w-4" />,
      label: `${listing.parking} parking ${listing.parking === 1 ? "space" : "spaces"}`,
    });
  }

  if (listing?.upkeepType) {
    chips.push({
      icon: <SparklesIcon className="h-4 w-4" />,
      label: upkeepLabel[listing.upkeepType] ?? listing.upkeepType,
    });
  }

  if (listing?.bathrooms) {
    chips.push({
      icon: <WrenchScrewdriverIcon className="h-4 w-4" />,
      label: `${listing.bathrooms} ${listing.bathrooms === 1 ? "bathroom" : "bathrooms"}`,
    });
  }

  if (!chips.length) return null;

  return (
    <div className="scrollbar-hide overflow-x-auto">
      <div className="flex min-w-max gap-3 pb-1">
        {chips.map((chip, i) => (
          <Chip key={i} {...chip} />
        ))}
      </div>
    </div>
  );
};
