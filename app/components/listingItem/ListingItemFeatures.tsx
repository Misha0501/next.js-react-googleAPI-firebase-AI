import type { ListingFeature } from "@/app/components/listingItem/ListingItemData";

type ListingItemFeaturesProps = {
  features: ListingFeature[];
  hiddenFeatureCount: number;
  isLoading?: boolean;
};

export const ListingItemFeatures = ({
  features,
  hiddenFeatureCount,
  isLoading,
}: ListingItemFeaturesProps) => {
  if (isLoading) {
    return <div className="h-[34px] w-[260px] animate-pulse rounded bg-slate-200" />;
  }

  return (
    <>
      {features.map((feature) => (
        <div
          key={feature.key}
          title={feature.label}
          className="flex max-w-full items-center gap-1.5 rounded-full border border-slate-200 bg-[#F8FAFC] px-3 py-1.5 text-[13px] font-semibold leading-5 text-[#4A5468]"
        >
          <span className="text-[#1F5FD6]">{feature.icon}</span>
          <span className="whitespace-nowrap">{feature.label}</span>
        </div>
      ))}
      {hiddenFeatureCount > 0 && (
        <div className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[13px] font-semibold leading-5 text-[#717D96]">
          +{hiddenFeatureCount} more
        </div>
      )}
    </>
  );
};
