import { useMutation, UseMutationResult } from "react-query";
import * as api from "./api";
import { Description } from "./types";

const KEY = "Generate";
export function useGenerateDescription(
  props: Description.CreateProps = {}
): UseMutationResult<
  string,
  any,
  Description.CreateMutationPayload
> {
  return useMutation((payload) => api.generate({ ...props, data: payload }), {
    mutationKey: `${KEY} | Create`,
    retry: 0,
  });
}
