import { NextRequest, NextResponse } from "next/server";
import { ApplicationUser } from "@/types";
import { getApplicationUserServer } from "@/app/lib/getApplicationUserServer";
import { savedListingsSchema } from "@/app/lib/validations/savedListings";
import {
  getSavedListings,
  handleSavedListingCreation,
} from "@/app/api/savedListings/_utils";
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

    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page") ?? 1);
    const pageSize = Number(searchParams.get("pageSize") ?? 20);

    const savedListings = await getSavedListings(
      applicationUser.id,
      page,
      pageSize,
    );

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
