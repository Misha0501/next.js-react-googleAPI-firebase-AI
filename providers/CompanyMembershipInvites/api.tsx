import service from "../../services";

export async function companyMembershipInvites(props?: any): Promise<any> {
  return service({
    method: "GET",
    url: `/api/companyMembershipInvites`,
    headers: {
      //@ts-ignore
      Authorization: props.authToken,
    },
  });
}

export async function create(props: any, authToken?: string) {
  return service({
    method: "POST",
    url: `/api/companyMembershipInvites`,
    body: props.data,
    headers: {
      //@ts-ignore
      Authorization: props.authToken,
    },
  });
}

export async function decline(props: any, authToken?: string) {
  return service({
    method: "POST",
    url: `/api/companyMembershipInvites/decline`,
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
    url: `/api/companyMembershipInvites/${props.data.id}`,
    body: props.data,
    headers: {
      //@ts-ignore
      Authorization: props.authToken,
    },
  });
}
