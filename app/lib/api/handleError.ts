import { z } from "zod";
import { Prisma } from "@/generated/prisma/client";
import { ResponseError } from "@/app/lib/classes/ResponseError";

/**
 * Handles errors from API operations, returning a standardized response.
 * It supports Zod validation errors, custom response errors, and authentication errors.
 * If the error type is not recognized, it defaults to a generic server error.
 *
 * @param {any} error - The error object thrown during API operations.
 * @returns {Response} - The constructed response object based on the error.
 */
export const handleAPIError = (error: unknown): Response => {
  console.error(error);
  if (error instanceof z.ZodError) {
    return new Response(error.issues.map((i) => i.message).join("; "), {
      status: 422,
    });
  }
  if (error instanceof ResponseError) {
    return new Response(error.message, { status: error.status });
  }
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2025") {
      return new Response("The requested record was not found.", {
        status: 404,
      });
    }
  }
  if (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    (error as { status?: unknown }).status === 429
  ) {
    return new Response("AI quota exceeded. Please try again in a moment.", {
      status: 503,
    });
  }
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof (error as { code?: unknown }).code === "string" &&
    (error as { code: string }).code.startsWith("auth/")
  ) {
    return new Response(
      "Your auth token is invalid or it has expired. Get a new auth token and try again.",
      { status: 400 },
    );
  }
  return new Response("Something went wrong please try again later", {
    status: 500,
  });
};
