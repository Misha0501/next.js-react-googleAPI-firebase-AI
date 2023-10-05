import service from "../../services";

export async function deleteItem(props: any) {
  return service({
    method: "DELETE",
    parseJSON: false,
    url: `/api/images/${props.data.id}`,
    body: props.data,
    headers: {
      //@ts-ignore
      Authorization: props.authToken,
    },
  });
}
