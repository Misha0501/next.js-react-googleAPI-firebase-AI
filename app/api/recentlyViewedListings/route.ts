import { NextRequest, NextResponse } from "next/server";
import { ApplicationUser } from "@/types";
import { getApplicationUserServer } from "@/app/lib/getApplicationUserServer";
import { recentlyViewedListingsSchema } from "@/app/lib/validations/recentlyViewedListings";
import { handleAPIError } from "@/app/lib/api/handleError";
import { getRecentlyViewedListings, handleRecentlyViewedCreation } from "@/app/api/recentlyViewedListings/_utils";

/**
 * GET recently viewed listings of the user
 * @param req
 * @constructor
 */
export async function GET(req: NextRequest) {
  try {
    const applicationUser: ApplicationUser =
      await getApplicationUserServer(true);

    const recentlyViewedListings = await getRecentlyViewedListings(
      applicationUser.id,
    );

    return NextResponse.json(recentlyViewedListings);
  } catch (error) {
    return handleAPIError(error);
  }
}

/**
 * POST Route to create recently viewed listing.
 * @param req
 * @constructor
 */
export async function POST(req: Request) {
  try {
    const applicationUser: ApplicationUser =
      await getApplicationUserServer(true);

    const parsedValues = recentlyViewedListingsSchema.parse(await req.json());

    const result = await handleRecentlyViewedCreation(
      applicationUser.id,
      parsedValues.listingId,
    );

    return NextResponse.json(result);
  } catch (error) {
    return handleAPIError(error);
  }
}
