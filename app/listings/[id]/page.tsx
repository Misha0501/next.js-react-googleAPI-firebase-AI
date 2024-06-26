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
import { getFetchUrl } from "@/app/lib/getFetchUrl";
import { notFound } from "next/navigation";
import { ResponseError } from "@/app/lib/classes/ResponseError";

type Props = {
  params: {
    id: string;
  };
};

async function ListingPage({ params: { id } }: Props) {
  const listingId = Number(id);
  let listing = null;

  try {
    // fetch listing
    const response = await fetch(getFetchUrl(`/api/listings/${listingId}`));

    if (!response.ok) {
      if (response.status === 404) {
        throw new ResponseError("Listing not found", 404)
      }

      throw new Error("Data fetch failed");
    }

    listing = await response.json();

  } catch (error) {
    console.error(error);
    if (error instanceof ResponseError) {
      if(error.status === 404) {
        return notFound();
      }
    }

    return <div className={"text-red-500 container text-center font-bold"}>Oops an error occurred. Please try again later..</div>;
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

        <PriceChangeGraphSection listingPriceArray={listing?.ListingPrice ?? []} />

        <FloatingContactBar listing={listing} />

        <ListingDetailRecentlyViewedFunctionality listingId={listingId} />
      </div>
    </ListigDetailContextProvider>
  );
}

export default ListingPage;
