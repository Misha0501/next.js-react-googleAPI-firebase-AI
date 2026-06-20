import service from "@/services";
import { SavedListingsProvider } from "@/providers/SavedListings/types";
import { SavedListing } from "@/types";

type CreateProps = {
  data: SavedListingsProvider.CreateMutationPayload;
};
type DeleteProps = {
  data: SavedListingsProvider.DeleteMutationPayload;
};

export async function savedListings(
  props?: { page?: number },
): Promise<SavedListingsProvider.ReadResponse> {
  const page = props?.page ?? 1;
  return service<SavedListingsProvider.ReadResponse>({
    method: "GET",
    url: `/api/savedListings?page=${page}&pageSize=8`,
  });
}

export async function savedListingIds(): Promise<
  { id: number; listingId: number }[]
> {
  return service<{ id: number; listingId: number }[]>({
    method: "GET",
    url: `/api/savedListings/ids`,
  });
}

export async function create(props: CreateProps): Promise<SavedListing> {
  return service<SavedListing>({
    method: "POST",
    url: `/api/savedListings`,
    body: props.data as Record<string, unknown>,
  });
}

export async function deleteItem(props: DeleteProps): Promise<null> {
  return service<null>({
    method: "DELETE",
    parseJSON: false,
    url: `/api/savedListings/${props.data.id}`,
  });
}
