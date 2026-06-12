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

const Chip = ({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) => (
  <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2.5 whitespace-nowrap">
    <span className="text-[#717D96]">{icon}</span>
    <span className="text-sm text-[#2D3648] font-medium">{label}</span>
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
    const label =
      listing?.numberOfFloorsCommon
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
    chips.push({ icon: <CalendarIcon className="h-4 w-4" />, label: `Built ${year}` });
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
    <div className="my-6 overflow-x-auto scrollbar-hide">
      <div className="flex gap-3 pb-1 min-w-max">
        {chips.map((chip, i) => (
          <Chip key={i} {...chip} />
        ))}
      </div>
    </div>
  );
};
