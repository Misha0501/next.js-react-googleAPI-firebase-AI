import { z } from "zod";
import { ResponseError } from "@/app/lib/classes/ResponseError";

export const handleAPIError = (error: any): Response => {
  console.error(error);
  if (error instanceof z.ZodError) {
    return new Response(error.message, { status: 422 });
  }
  if (error instanceof ResponseError) {
    return new Response(error.message, { status: error.status });
  }
  if (error.errorInfo && error.errorInfo.code) {
    return new Response('Your auth token is invalid or it has expired. Get a new auth token and try again.', { status: 400 });
  }
  return new Response('Something went wrong please try again later', {
    status: 500,
  });
};
