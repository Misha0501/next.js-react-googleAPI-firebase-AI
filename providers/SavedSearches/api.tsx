import service from "@/services";
import { SavedSearchesProvider } from "@/providers/SavedSearches/types";

type CreateProps = {
  data: SavedSearchesProvider.CreateMutationPayload;
};
type DeleteProps = {
  data: SavedSearchesProvider.DeleteMutationPayload;
};

export async function savedSearches(
  props?: { page?: number },
): Promise<SavedSearchesProvider.ReadResponse> {
  const page = props?.page ?? 1;
  return service<SavedSearchesProvider.ReadResponse>({
    method: "GET",
    url: `/api/savedSearches?page=${page}&pageSize=8`,
  });
}

export async function create(props: CreateProps) {
  return service({
    method: "POST",
    url: `/api/savedSearches`,
    body: props.data as Record<string, unknown>,
  });
}

export async function deleteItem(props: DeleteProps) {
  return service({
    method: "DELETE",
    parseJSON: false,
    url: `/api/savedSearches/${props.data.id}`,
  });
}
