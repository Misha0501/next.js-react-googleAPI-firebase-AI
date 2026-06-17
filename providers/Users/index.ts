import {
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult,
} from "@tanstack/react-query";
import * as api from "@/providers/Users/api";
import { ApplicationUserProvider } from "@/providers/Users/types";
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
  return useQuery({
    queryKey: getKeyFromProps(props, "DETAIL"),
    queryFn: () => api.userDetail(props),
    retry: 0,
  });
}

export function useUserOwnData(
  props: ApplicationUserProvider.GetProps,
): UseQueryResult<ApplicationUserProvider.DetailResponse> {
  return useQuery({
    queryKey: getKeyFromProps(props, "OWN DATA"),
    queryFn: () => api.userOwnData(props),
    enabled: Boolean(props?.authToken),
    retry: 0,
  });
}

export function useUpdateUser(
  props: ApplicationUserProvider.GetProps,
): UseMutationResult<
  ApplicationUser,
  Error,
  ApplicationUserProvider.UpdatePropsMutation
> {
  return useMutation({
    mutationFn: (payload) => api.update({ ...props, data: payload }),
    mutationKey: [KEY, "Update"],
    retry: 0,
  });
}
