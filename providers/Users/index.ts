import {
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult,
} from "react-query";
import * as api from "./api";
import { ApplicationUserProvider } from "./types";
import { ApplicationUser } from "@/types";

const KEY = "Users";

export function getKeyFromProps(
  props: any,
  type: "OWN DATA" | "DETAIL",
): string[] {
  const key = [KEY, type];
  key.push(props);
  return key;
}

export function useUserDetail(
  props: ApplicationUserProvider.GetProps,
): UseQueryResult<ApplicationUserProvider.DetailResponse> {
  return useQuery(
    getKeyFromProps(props, "DETAIL"),
    () => api.userDetail(props),
    {
      retry: 0,
    },
  );
}

export function useUserOwnData(
  props: ApplicationUserProvider.GetProps,
): UseQueryResult<ApplicationUserProvider.DetailResponse> {
  return useQuery(
    getKeyFromProps(props, "OWN DATA"),
    () => api.userOwnData(props),
    {
      retry: 0,
    },
  );
}

export function useUpdateUser(
  props: any,
): UseMutationResult<ApplicationUser, any, ApplicationUser> {
  return useMutation((payload) => api.update({ ...props, data: payload }), {
    mutationKey: `${KEY} | Update`,
    retry: 0,
  });
}
