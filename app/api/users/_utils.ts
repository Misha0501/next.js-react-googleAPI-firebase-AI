import { prisma } from "@/app/lib/db/client";
import { handleAPIError } from "@/app/lib/api/handleError";

/**
 * Finds an application user by their email and includes related records.
 *
 * @param {string} email - The email of the user.
 * @returns {Promise<any>} - The application user along with related entities such as Membership, Invoice, Listing, SavedListing, and SavedSearch.
 */
export const findApplicationUserByEmail = async (
  email: string,
): Promise<any> => {
  return await prisma.applicationUser.findUnique({
    where: { email },
    include: {
      Membership: {
        include: {
          company: {
            include: {
              Listing: {
                include: {
                  ListingImage: true,
                  Address: true,
                  ListingPrice: {
                    orderBy: {
                      createdAt: "asc",
                    },
                  },
                },
                where: {
                  deleted: null,
                },
              },
            },
          },
        },
      },
      Invoice: true,
      Listing: {
        include: {
          ListingImage: true,
          Address: true,
          ListingPrice: {
            orderBy: {
              createdAt: "asc",
            },
          },
        },
        where: {
          deleted: null,
        },
      },
      SavedListing: true,
      SavedSearch: true,
    },
  });
};

/**
 * Handles errors that arise during user API update operations.
 * Returns appropriate response based on the error.
 *
 * @param {any} error - The error object thrown during the user API update.
 * @returns {Response} - The constructed response object based on the error.
 */
export const handleUserAPIUpdateError = (error: unknown): Response => {
  const firebaseErrorCode =
    typeof error === "object" && error !== null && "code" in error
      ? (error as { code?: string }).code
      : undefined;

  if (firebaseErrorCode?.startsWith("auth/")) {
    console.error(error);
    if (firebaseErrorCode === "auth/invalid-phone-number") {
      return new Response("The authentication phone number is invalid.", {
        status: 400,
      });
    }

    if (firebaseErrorCode === "auth/invalid-password") {
      return new Response(
        "The password must be a string with at least 6 characters.",
        { status: 400 },
      );
    }

    return new Response(
      "Your session is invalid or has expired. Please sign in again.",
      { status: 400 },
    );
  }

  return handleAPIError(error);
};
