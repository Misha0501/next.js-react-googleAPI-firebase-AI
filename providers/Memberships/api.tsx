import service from "../../services";

export async function companyMemberships(props?: any): Promise<any> {
  return service({
    method: "GET",
    url: `/api/memberships`,
    headers: {
      //@ts-ignore
      Authorization: props.authToken,
    },
  });
}

// Create
export async function create(
  props: any,
  authToken?: string
){
  return service({
    method: "POST",
    url: `/api/memberships`,
    body: props.data,
    headers: {
      //@ts-ignore
      Authorization: props.authToken,
    },
  });
}