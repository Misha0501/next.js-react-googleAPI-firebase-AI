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
