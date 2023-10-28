import { SavedListing } from "@/types";

export namespace SavedListingsProvider {
  export type ReadResponse = {
    total: number;
    results: SavedListing[];
  }

  export type CreateMutationPayload = { listingId: number };

  export type DeleteMutationPayload = { id: number };
}
