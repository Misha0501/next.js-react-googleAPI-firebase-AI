import service from "@/services";

export async function create(props: any, authToken?: string) {
  return service({
    method: "POST",
    url: `/api/companies`,
    body: props.data,
    headers: {
      //@ts-ignore
      Authorization: props.authToken,
    },
  });
}

export async function update(
  props: any,
  authToken?: string
) {
  return service({
    method: "PUT",
    url: `/api/companies`,
    body: props.data,
    headers: {
      //@ts-ignore
      Authorization: props.authToken,
    },
  });
}

