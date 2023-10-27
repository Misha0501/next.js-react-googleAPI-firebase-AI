import { z } from "zod";
import { ResponseError } from "@/app/lib/classes/ResponseError";

/**
 * Handles errors from API operations, returning a standardized response.
 * It supports Zod validation errors, custom response errors, and authentication errors.
 * If the error type is not recognized, it defaults to a generic server error.
 *
 * @param {any} error - The error object thrown during API operations.
 * @returns {Response} - The constructed response object based on the error.
 */
export const handleAPIError = (error: any): Response => {
  console.error(error);
  if (error instanceof z.ZodError) {
    return new Response(error.message, { status: 422 });
  }
  if (error instanceof ResponseError) {
    return new Response(error.message, { status: error.status });
  }
  if (error.errorInfo && error.errorInfo.code) {
    return new Response(
      "Your auth token is invalid or it has expired. Get a new auth token and try again.",
      { status: 400 },
    );
  }
  return new Response("Something went wrong please try again later", {
    status: 500,
  });
};
