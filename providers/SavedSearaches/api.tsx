import service from "../../services";

export async function savedSearches(props?: any): Promise<any> {
  return service({
    method: "GET",
    url: `/api/savedSearches`,
    queryParams: props,
    headers: {
      //@ts-ignore
      Authorization: props.authToken,
    },
  });
}

export async function create(
  props: any,
  authToken?: string
) {
  return service({
    method: "POST",
    url: `/api/savedSearches`,
    body: props.data,
    headers: {
      //@ts-ignore
      Authorization: props.authToken,
    },
  });
}

export async function deleteItem(props: any) {
  return service({
    method: "DELETE",
    parseJSON: false,
    url: `/api/savedSearches/${props.data.id}`,
    body: props.data,
    headers: {
      //@ts-ignore
      Authorization: props.authToken,
    },
  });
}
