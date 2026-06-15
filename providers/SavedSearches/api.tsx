import service from "../../services";
import { SavedSearchesProvider } from "./types";
import type { AuthProps } from "@/providers/types";

type CreateProps = AuthProps & { data: SavedSearchesProvider.CreateMutationPayload };
type DeleteProps = AuthProps & { data: SavedSearchesProvider.DeleteMutationPayload };

export async function savedSearches(props?: AuthProps): Promise<SavedSearchesProvider.ReadResponse> {
  return service<SavedSearchesProvider.ReadResponse>({
    method: "GET",
    url: `/api/savedSearches`,
    headers: { Authorization: props?.authToken ?? "" },
  });
}

export async function create(props: CreateProps) {
  return service({
    method: "POST",
    url: `/api/savedSearches`,
    body: props.data as Record<string, unknown>,
    headers: { Authorization: props.authToken ?? "" },
  });
}

export async function deleteItem(props: DeleteProps) {
  return service({
    method: "DELETE",
    parseJSON: false,
    url: `/api/savedSearches/${props.data.id}`,
    headers: { Authorization: props.authToken ?? "" },
  });
}
