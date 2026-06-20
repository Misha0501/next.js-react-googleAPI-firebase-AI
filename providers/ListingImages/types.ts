export namespace ListingsImagesProvider {
  export interface DeleteMutationProps {
    id: number;
  }

  export interface UploadResponse {
    url: string;
    imagePath: string;
  }

  export interface DeleteByPathProps {
    imagePath: string;
  }
}
