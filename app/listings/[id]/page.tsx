import { ListingTitleSection } from "@/app/components/listingDetailPage/ListingTitleSection";
import { ListingDetailSavedButton } from "@/app/components/listingDetailPage/ListingDetailSavedButton";
import { ListingDetailImages } from "@/app/components/listingDetailPage/ListingDetailImages";
import { KeyHighlightsBar } from "@/app/components/listingDetailPage/KeyHighlightsBar";
import { ListingMainInfo } from "@/app/components/listingDetailPage/ListingMainInfo";
import { ListingDetailContent } from "@/app/components/listingDetailPage/ListingDetailContent";
import { Divider } from "@tremor/react";
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
      <div className={"text-red-500 container text-center font-bold"}>
        Oops an error occurred. Please try again later..
      </div>
    );
  }

  if (!listing) {
    return notFound();
  }

  return (
    <ListigDetailContextProvider>
      <div className="pb-32 lg:pb-10">
        <div className="container">
          <div className="pt-8 lg:pt-10">
            <div className="flex items-center justify-between">
              <ListingTitleSection listing={listing} />

              <div>
                <ListingDetailSavedButton
                  listingId={listingId}
                  showOnDesktop={true}
                />
              </div>
            </div>

            <div className="lg:mt-8 lg:mb-4">
              <ListingDetailImages images={listing?.ListingImage} />
            </div>

            <KeyHighlightsBar listing={listing} />

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
              <div className="lg:col-span-2">
                <ListingMainInfo listing={listing} />

                <ListingDetailContent listing={listing} />

                <Divider className="hidden lg:block" />

                <MapsSection address={listing?.Address?.[0]} />
              </div>

              <div className="col-span-1 lg:col-span-1 flex flex-col gap-4">
                <ListingAgentContactCard listing={listing} />
                <NeighbourhoodPriceCallout listing={listing} />
              </div>
            </div>
          </div>
        </div>

        <ListingTimeline listing={listing} />

        <PriceChangeGraphSection listingPriceArray={listing?.ListingPrice ?? []} />

        <FloatingContactBar listing={listing} />

        <ListingDetailRecentlyViewedFunctionality listingId={listingId} />
      </div>
    </ListigDetailContextProvider>
  );
}

export default ListingPage;
