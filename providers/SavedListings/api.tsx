import service from "../../services";
import { SavedListingsProvider } from "@/providers/SavedListings/types";
import { SavedListing } from "@/types";
import type { AuthProps } from "@/providers/types";

type CreateProps = AuthProps & { data: SavedListingsProvider.CreateMutationPayload };
type DeleteProps = AuthProps & { data: SavedListingsProvider.DeleteMutationPayload };

export async function savedListings(
  props?: AuthProps,
): Promise<SavedListingsProvider.ReadResponse> {
  return service<SavedListingsProvider.ReadResponse>({
    method: "GET",
    url: `/api/savedListings`,
    headers: { Authorization: props?.authToken ?? "" },
  });
}

export async function create(props: CreateProps): Promise<SavedListing> {
  return service<SavedListing>({
    method: "POST",
    url: `/api/savedListings`,
    body: props.data as Record<string, unknown>,
    headers: { Authorization: props.authToken ?? "" },
  });
}

export async function deleteItem(props: DeleteProps): Promise<null> {
  return service<null>({
    method: "DELETE",
    parseJSON: false,
    url: `/api/savedListings/${props.data.id}`,
    headers: { Authorization: props.authToken ?? "" },
  });
}
