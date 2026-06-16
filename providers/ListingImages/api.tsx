import service from "@/services";
import { ListingsImagesProvider } from "@/providers/ListingImages/types";
import type { AuthProps } from "@/providers/types";

type DeleteProps = AuthProps & {
  data: ListingsImagesProvider.DeleteMutationProps;
};

export async function deleteItem(props: DeleteProps): Promise<null> {
  return service({
    method: "DELETE",
    parseJSON: false,
    url: `/api/images/${props.data.id}`,
    headers: { Authorization: props.authToken ?? "" },
  });
}
