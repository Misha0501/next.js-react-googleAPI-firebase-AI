import { ResponseError } from "@/app/lib/classes/ResponseError";

export const validateParamId = (slug: number): number => {
  const id = Number(slug);
  if (isNaN(id)) throw new ResponseError("ID must be a valid number", 422);
  return id;
}
