import { NextRequest, NextResponse } from "next/server";
import { ApplicationUser } from "@prisma/client";
import { getApplicationUserServer } from "@/app/lib/getApplicationUserServer";
import { savedListingsSchema } from "@/app/lib/validations/savedListings";
import { getSavedListings, handleSavedListingCreation } from "@/app/api/savedListings/_utils";
import { handleAPIError } from "@/app/lib/api/handleError";

/**
 * GET saved listings of the user
 * @param req
 * @constructor
 */
export async function GET(req: NextRequest) {
  try {
    const applicationUser: ApplicationUser =
      await getApplicationUserServer(true);

    const savedListings = await getSavedListings(applicationUser.id);

    return NextResponse.json(savedListings);
  } catch (error) {
    return handleAPIError(error);
  }
}

/**
 * POST Route to create new saved listing for a user.
 * @param req
 * @constructor
 */
export async function POST(req: Request) {
  try {
    const applicationUser: ApplicationUser =
      await getApplicationUserServer(true);

    const parsedValues = savedListingsSchema.parse(await req.json());

    const savedListing = await handleSavedListingCreation(
      applicationUser.id,
      parsedValues.listingId,
    );

    return NextResponse.json(savedListing);
  } catch (error) {
    return handleAPIError(error);
  }
}
