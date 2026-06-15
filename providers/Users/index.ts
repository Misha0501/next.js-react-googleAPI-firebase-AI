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
  props: ApplicationUserProvider.GetProps,
  type: "OWN DATA" | "DETAIL",
): (string | ApplicationUserProvider.GetProps)[] {
  return [KEY, type, props];
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
      enabled: Boolean(props?.authToken),
      retry: 0,
    },
  );
}

export function useUpdateUser(
  props: ApplicationUserProvider.GetProps,
): UseMutationResult<ApplicationUser, Error, ApplicationUserProvider.UpdatePropsMutation> {
  return useMutation((payload) => api.update({ ...props, data: payload }), {
    mutationKey: `${KEY} | Update`,
    retry: 0,
  });
}
