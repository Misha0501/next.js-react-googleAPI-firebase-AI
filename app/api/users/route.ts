import { NextResponse } from "next/server";
import { z } from "zod";
import { getApplicationUserServer } from "@/app/lib/getApplicationUserServer";
import { ResponseError } from "@/app/lib/classes/ResponseError";
import { getDecodedIdToken } from "@/app/lib/getDecodedIdToken";
import { prisma } from "@/app/lib/db/client";
import { ApplicationUser } from "@prisma/client";
import { userPUTSchema } from "@/app/lib/validations/user";
import { firebaseAdmin } from "@/app/lib/firebase/configAdmin";

/**
 * GET Route to retrieve users data
 * @param req
 * @constructor
 */
export async function GET(req: Request) {
  try {
    const decodedToken = await getDecodedIdToken();

    const applicationUser = await prisma.applicationUser.findUnique({
      where: { email: decodedToken.email },
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

    return NextResponse.json(applicationUser);
  } catch (error) {
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
  }
}

/**
 * PUT Route to update users data
 * @param req
 * @constructor
 */
export async function PUT(req: Request) {
  try {
    const applicationUser: ApplicationUser =
      await getApplicationUserServer(true);

    const parsedValues = userPUTSchema.parse(await req.json());
    const { displayName, phoneNumber, newPassword } = parsedValues;

    await firebaseAdmin.auth().updateUser(applicationUser.firebaseUID, {
      displayName,
      phoneNumber,
      ...(newPassword && { password: newPassword }),
    });

    const updatedApplicationUser = await prisma.applicationUser.update({
      where: { id: applicationUser.id },
      data: {
        displayName,
        phoneNumber,
        // ...(newPassword && { password: newPassword }),
      },
    });

    return NextResponse.json(updatedApplicationUser);
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }

    if (error instanceof ResponseError) {
      return new Response(error.message, { status: error.status });
    }

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

    return new Response("Something went wrong please try again later", {
      status: 500,
    });
  }
}
