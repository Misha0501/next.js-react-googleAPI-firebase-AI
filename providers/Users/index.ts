import { UseQueryResult, useQuery } from "react-query";
import * as api from "./api";
import { Users } from "./types";

const KEY = "Users";

export function getKeyFromProps(
  props: any,
  type: "LISTING" | "DETAIL"
): string[] {
  const key = [KEY, type];
  key.push(props);
  return key;
}

export function useUserDetail(
  props: Users.DetailProps
): UseQueryResult<Users.DetailResponse> {
  return useQuery(
    getKeyFromProps(props, "DETAIL"),
    () => api.userDetail(props),
    {
      retry: 0,
    }
  );
}
