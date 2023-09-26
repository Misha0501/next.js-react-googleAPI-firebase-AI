import { UseQueryResult, useQuery, useMutation } from "react-query";
import * as api from "./api";
import { Users } from "./types";
import { userOwnData } from "./api";

const KEY = "Users";

export function getKeyFromProps(
  props: any,
  type: "OWN DATA" | "DETAIL"
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

export function useUserOwnData(
  props: Users.DetailProps
): UseQueryResult<Users.DetailResponse> {
  return useQuery(
    getKeyFromProps(props, "OWN DATA"),
    () => api.userOwnData(props),
    {
      retry: 0,
    }
  );
}

export function useUpdateUser(
  props: any
) {
  // const queryClient = useQueryClient();
  return useMutation((payload) => api.update({ ...props, data: payload }), {
    mutationKey: `${KEY} | Update`,
    retry: 0
  });
}

