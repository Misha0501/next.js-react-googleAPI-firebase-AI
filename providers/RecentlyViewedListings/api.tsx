import service from "../../services";

export async function recentlyViewedListings(props?: any): Promise<any> {
  return service({
    method: "GET",
    url: `/api/recentlyViewedListings`,
    headers: {
      Authorization: props.authToken,
    },
  });
}

export async function create(
  props: any,
) {
  return service({
    method: "POST",
    url: `/api/recentlyViewedListings`,
    body: props.data,
    headers: {
      Authorization: props.authToken,
    },
  });
}
