import { prisma } from "@/app/lib/db/client";
import { handleAPIError } from "@/app/lib/api/handleError";

export const findApplicationUserByEmail = async (email: string): Promise<any> => {
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

export const handleUserAPIUpdateError = (error: any): Response => {
  console.error(error);

  if (error.errorInfo && error.errorInfo.code) {
    if(error.errorInfo.code === "auth/invalid-phone-number") {
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

  return handleAPIError(error)
}
