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
                  ListingPrice: true,
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
          ListingPrice: true,
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
export const handleUserAPIUpdateError = (error: any): Response => {
  if (error.errorInfo && error.errorInfo.code) {
    console.error(error);
    if (error.errorInfo.code === "auth/invalid-phone-number") {
      return new Response(
        "Invalid phone number. Example of valid phone number: +35923443234",
        { status: 400 },
      );
    }

    if (error.errorInfo.code === "auth/invalid-password") {
      return new Response(
        "The password must be a string with at least 6 characters.",
        { status: 400 },
      );
    }

    return new Response(
      "Your auth token is invalid or it has expired. Get a new auth token and try again.",
      { status: 400 },
    );
  }

  return handleAPIError(error);
};
