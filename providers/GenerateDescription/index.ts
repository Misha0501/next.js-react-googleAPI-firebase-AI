import {
  UseMutationResult,
  UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from "react-query";
import * as api from "./api";
import { Description } from "./types";

const KEY = "Generate";

export function getKeyFromProps(
  props: any,
  type: "LISTING" | "DETAIL"
): string[] {
  const key = [KEY, type];
  key.push(props);
  return key;
}

export function useGenerateDescription(
  props: Description.CreateProps = {}
): UseMutationResult<
  Description.CreateResponse,
  {
    message?: string;
  },
  Description.CreateMutationPayload
> {
  const queryClient = useQueryClient();
  return useMutation((payload) => api.generate({ ...props, data: payload }), {
    mutationKey: `${KEY} | Create`,
    retry: 0,
  });
}
