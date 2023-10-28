import service from "@/services";
import { Description } from "./types";

// Create
export async function generate(
  props: Description.CreateAPIPayload
): Promise<string> {
  return service({
    method: "POST",
    url: `/api/generateDescription`,
    body: props.data,
  });
}
