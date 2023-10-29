import { RecentlyViewedListing } from "@/types";

export namespace RecentlyViewedListingsProvider {
  export type GetProps = {
    authToken?: string | null;
  };

  export type GetResponse = {
    total: number;
    results: RecentlyViewedListing[];
  };

  export type CreateProps = GetProps & {
    listingId: number;
  };
}
