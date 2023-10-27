import { ListingTitleSection } from "@/app/components/listingDetailPage/ListingTitleSection";
import { ListingDetailSavedButton } from "@/app/components/listingDetailPage/ListingDetailSavedButton";
import { ListingDetailImages } from "@/app/components/listingDetailPage/ListingDetailImages";
import { ListingMainInfo } from "@/app/components/listingDetailPage/ListingMainInfo";
import { ListingDetailContent } from "@/app/components/listingDetailPage/ListingDetailContent";
import { Divider } from "@tremor/react";
import { MapsSection } from "@/app/components/listingDetailPage/MapsSection";
import { ListingAgentContactCard } from "@/app/components/ListingAgentContactCard";
import { PriceComparisonGraphSection } from "@/app/components/listingDetailPage/PriceComparisonGraphSection";
import { PriceChangeGraphSection } from "@/app/components/listingDetailPage/PriceChangeGraphSection";
import FloatingContactBar from "@/app/components/listingDetailPage/FloatingContactBar";
import { ListingDetailRecentlyViewedFunctionality } from "@/app/components/listingDetailPage/ListingDetailRecentlyViewedFunctionality";
import { ListigDetailContextProvider } from "@/app/context/ListingDetailContext";

export const revalidate = 300;

type Props = {
  params: {
    id: string;
  };
};

async function ListingPage({ params: { id } }: Props) {
  const listingId = Number(id);

  // fetch listing detail
  const response = await fetch(
    `http://localhost:3000/api/listings/${listingId}`,
  )


  const listing = await response.json();

  // TODO: handle 404
  // if (!listing) return notFound();

  return (
    <ListigDetailContextProvider>
      <div className="pb-32 lg:pb-10">
        <div className="container">
          <div className="pt-8 lg:pt-10">
            <div className="flex items-center justify-between">
              <ListingTitleSection listing={listing} />

              <div>
                <ListingDetailSavedButton listingId={listingId} showOnDesktop={true}/>
              </div>
            </div>

            <div className="lg:mt-8 lg:mb-4">
              <ListingDetailImages images={listing?.ListingImage} />
            </div>

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
              <div className="lg:col-span-2">
                <ListingMainInfo listing={listing} />

                <ListingDetailContent listing={listing} />

                <Divider className="hidden lg:block" />

                <MapsSection address={listing?.Address?.[0]} />
              </div>

              <div className="col-span-1 lg:col-span-1">
                <ListingAgentContactCard listing={listing} />
              </div>
            </div>
          </div>
        </div>

        <PriceComparisonGraphSection listing={listing} />

        <PriceChangeGraphSection listingPriceArray={listing?.ListingPrice} />

        <FloatingContactBar
          listing={listing}
        />

        <ListingDetailRecentlyViewedFunctionality listingId={listingId} />
      </div>
    </ListigDetailContextProvider>
  );
}

export default ListingPage;
