import { NextResponse } from "next/server";
import { z } from "zod";
import { getApplicationUserServer } from "@/app/lib/getApplicationUserServer";
import { ResponseError } from "@/classes/ResponseError";
import { getDecodedIdToken } from "@/app/lib/getDecodedIdToken";
import { prisma } from "@/app/lib/db/client";
import { ApplicationUser } from "@prisma/client";
import { listingSchemaPutRequest } from "@/app/lib/validations/listing";
import { userPUTSchema } from "@/app/lib/validations/user";

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
        Membership: true,
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
    const { displayName, phoneNumber, newPassword } =
      parsedValues;

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
