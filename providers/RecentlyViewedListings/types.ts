import { RecentlyViewedListing } from "@/types";

export namespace RecentlyViewedListingsProvider {
  export type GetProps = {
    enabled?: boolean;
    page?: number;
  };

  export type GetResponse = {
    page: number;
    pageSize: number;
    total: number;
    results: RecentlyViewedListing[];
  };

  export type CreateProps = {
    listingId?: number;
  };

  export type CreateMutationPayload = {
    listingId: number;
  };
}
