import { RecentlyViewedListing } from "@/types";

export namespace RecentlyViewedListingsProvider {
  export type GetProps = {
    authToken?: string | null;
    page?: number;
  };

  export type GetResponse = {
    page: number;
    pageSize: number;
    total: number;
    results: RecentlyViewedListing[];
  };

  export type CreateProps = {
    authToken?: string | null;
    listingId?: number;
  };

  export type CreateMutationPayload = {
    listingId: number;
  };
}
