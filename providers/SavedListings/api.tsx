import service from "../../services";
export async function savedListings(props?: any): Promise<any> {
  return service({
    method: "GET",
    url: `/api/savedListings`,
    headers: {
      //@ts-ignore
      Authorization: props.authToken,
    },
  });
}

export async function create(
  props: any,
  authToken?: string
){
  return service({
    method: "POST",
    url: `/api/savedListings`,
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
    url: `/api/savedListings/${props.data.id}`,
    body: props.data,
    headers: {
      //@ts-ignore
      Authorization: props.authToken,
    },
  });
}
