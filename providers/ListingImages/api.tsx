import service from "@/services";
import { ListingsImagesProvider } from "@/providers/ListingImages/types";

type DeleteProps = {
  data: ListingsImagesProvider.DeleteMutationProps;
};

export async function deleteItem(props: DeleteProps): Promise<null> {
  return service({
    method: "DELETE",
    parseJSON: false,
    url: `/api/images/${props.data.id}`,
  });
}

export async function uploadImage(
  file: File,
): Promise<ListingsImagesProvider.UploadResponse> {
  const formData = new FormData();
  formData.append("file", file);

  return service<ListingsImagesProvider.UploadResponse>({
    method: "POST",
    url: "/api/images/upload",
    formData: true,
    body: formData,
  });
}

export async function deleteImageByPath(
  props: ListingsImagesProvider.DeleteByPathProps,
): Promise<null> {
  return service({
    method: "DELETE",
    parseJSON: false,
    url: "/api/images/upload",
    body: { imagePath: props.imagePath },
  });
}
