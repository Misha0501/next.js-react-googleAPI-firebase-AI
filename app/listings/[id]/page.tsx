import { ListingTitleSection } from "@/app/components/listingDetailPage/ListingTitleSection";
import { ListingDetailSavedButton } from "@/app/components/listingDetailPage/ListingDetailSavedButton";
import { ListingDetailImages } from "@/app/components/listingDetailPage/ListingDetailImages";
import { KeyHighlightsBar } from "@/app/components/listingDetailPage/KeyHighlightsBar";
import { ListingMainInfo } from "@/app/components/listingDetailPage/ListingMainInfo";
import { ListingDetailContent } from "@/app/components/listingDetailPage/ListingDetailContent";
import { MapsSection } from "@/app/components/listingDetailPage/MapsSection";
import { ListingAgentContactCard } from "@/app/components/ListingAgentContactCard";
import { NeighbourhoodPriceCallout } from "@/app/components/listingDetailPage/NeighbourhoodPriceCallout";
import { ListingTimeline } from "@/app/components/listingDetailPage/ListingTimeline";
import { PriceChangeGraphSection } from "@/app/components/listingDetailPage/PriceChangeGraphSection";
import FloatingContactBar from "@/app/components/listingDetailPage/FloatingContactBar";
import { ListingDetailRecentlyViewedFunctionality } from "@/app/components/listingDetailPage/ListingDetailRecentlyViewedFunctionality";
import { ListigDetailContextProvider } from "@/app/context/ListingDetailContext";
import { notFound } from "next/navigation";
import { getFetchUrl } from "@/app/lib/getFetchUrl";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

const fetchListing = async (listingId: number) => {
  const response = await fetch(getFetchUrl(`/api/listings/${listingId}`), {
    cache: "no-store",
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Listing fetch failed with status ${response.status}`);
  }

  return response.json();
};

async function ListingPage({ params }: Props) {
  const { id } = await params;
  const listingId = Number(id);
  let listing: any = null;

  if (!Number.isInteger(listingId) || listingId <= 0) {
    return notFound();
  }

  try {
    listing = await fetchListing(listingId);
  } catch (error) {
    console.error(error);
    return (
      <div className="mx-auto max-w-screen-xl px-4 py-16 text-center font-semibold text-red-500 sm:px-6 lg:px-8">
        Oops an error occurred. Please try again later.
      </div>
    );
  }

  if (!listing) {
    return notFound();
  }

  return (
    <ListigDetailContextProvider>
      <div className="bg-[#F8FAFC] pb-32 lg:pb-16">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-6 pb-8 pt-6 lg:space-y-8 lg:pb-10 lg:pt-10">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <ListingTitleSection listing={listing} />

              <div className="hidden shrink-0 lg:block">
                <ListingDetailSavedButton
                  listingId={listingId}
                  showOnDesktop={true}
                />
              </div>
            </div>

            <ListingDetailImages images={listing?.ListingImage} />

            <KeyHighlightsBar listing={listing} />

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px] xl:gap-8">
              <main className="flex min-w-0 flex-col gap-6 lg:gap-8">
                <ListingMainInfo listing={listing} />

                <ListingDetailContent listing={listing} />

                <MapsSection address={listing?.Address?.[0]} />
              </main>

              <aside className="flex min-w-0 flex-col gap-5 xl:sticky xl:top-24 xl:self-start">
                <ListingAgentContactCard listing={listing} />
                <NeighbourhoodPriceCallout listing={listing} />
              </aside>
            </div>
          </div>
        </div>

        <div className="space-y-8 lg:space-y-10">
          <ListingTimeline listing={listing} />

          <PriceChangeGraphSection
            listingPriceArray={listing?.ListingPrice ?? []}
          />
        </div>

        <FloatingContactBar listing={listing} />

        <ListingDetailRecentlyViewedFunctionality listingId={listingId} />
      </div>
    </ListigDetailContextProvider>
  );
}

export default ListingPage;
